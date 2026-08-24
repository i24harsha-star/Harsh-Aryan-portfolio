#!/usr/bin/env python3
"""Image processing for the portfolio's public assets.

Modes:
  cover    <src.png> <out.jpg>   deck cover, colour (CSS applies greyscale)
  portrait <src.png> <out_dir>   hero portrait, monochrome + colour, 3 widths
  photos   <src_dir> <out_dir>   event photography, monochrome
  work     <src_dir> <out_dir>   supporting proof images, monochrome
"""

import os
import sys
import glob

from PIL import Image, ImageEnhance

Image.MAX_IMAGE_PIXELS = None


def _save(im, path, quality=82):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, "JPEG", quality=quality, optimize=True, progressive=True)


def _mono(im, contrast=1.18, brightness=1.02):
    """Editorial black-and-white: desaturate, then lift contrast slightly."""
    g = im.convert("L")
    g = ImageEnhance.Contrast(g).enhance(contrast)
    g = ImageEnhance.Brightness(g).enhance(brightness)
    return g.convert("RGB")


def _fit(im, width):
    if im.width <= width:
        return im.copy()
    h = round(im.height * width / im.width)
    return im.resize((width, h), Image.LANCZOS)


def thumb(src, out):
    """Case-competition thumbnail, normalised to exactly 16:9.

    The supplied artwork ranges from 1.777 to 2.009. The frame on the page is
    aspect-[16/9], so anything wider is cropped by object-cover from BOTH sides
    — and every one of these is left-aligned type with decorative marks on the
    right. Excess width is therefore taken off the right only, which trims
    decoration instead of clipping the title.
    """
    im = Image.open(src).convert("RGB")
    target = 16 / 9
    w, h = im.size
    if w / h > target:
        im = im.crop((0, 0, int(h * target), h))
    elif w / h < target:
        im = im.crop((0, 0, w, int(w / target)))
    _save(_fit(im, 1600), out, quality=86)
    print(f"   {os.path.basename(out)}  {im.size[0]}x{im.size[1]} -> 16:9")


def cover(src, out, trim_footer="0"):
    """Page-one cover image.

    `trim_footer` cuts a fraction off the bottom. The Team WhiteRock decks carry
    a footer strip with both teammates' email addresses, so theirs is trimmed.

    It is opt-in rather than applied to everything: trimming changes the aspect
    ratio, and the CV is displayed in an A4-shaped frame. Cropping 7% off its
    height took it from 0.707 to 0.760, and object-cover then removed the
    difference from the left and right edges — which is why the CV preview was
    clipped down both sides.
    """
    im = Image.open(src).convert("RGB")
    frac = float(trim_footer)
    if frac:
        im = im.crop((0, 0, im.width, int(im.height * (1 - frac))))
    _save(_fit(im, 1000), out)


def portrait(src, out_dir):
    """Chapter I portrait.

    Shipped in colour: it is the single colour element on an otherwise
    monochrome site, which makes it the focal point rather than a break in the
    system.

    One file only: next/image derives its own responsive variants from the
    source, so emitting several widths here just shipped bytes nothing linked to.
    """
    im = Image.open(src).convert("RGB")
    _save(_fit(im, 1600), os.path.join(out_dir, "portrait-colour-1600.jpg"))
    print("   portrait-colour-1600.jpg")


def background(src, out_dir):
    """Hero background plate.

    The source is a 4000x6000 portrait with a small subject and a lot of open
    grass. It is NOT hard-cropped to a landscape frame here: at 16:9 only ~42%
    of its height survives, and the figure alone is 82% of that, so any fixed
    crop either clips him or leaves no room for the type. Exporting the whole
    frame and letting CSS object-position choose the window keeps the framing
    tunable per breakpoint, and lets the native portrait serve mobile as shot.

    One file only: next/image derives its own responsive variants from the
    source, so emitting several widths here just shipped bytes nothing linked to.
    """
    im = Image.open(src).convert("RGB")
    _save(_mono(_fit(im, 2400), contrast=1.22), os.path.join(out_dir, "bg-hero-2400.jpg"), quality=80)
    print("   bg-hero-2400.jpg")


# The three photographs currently in the source folder, in display order.
# Kept as an explicit list rather than a directory sweep so that removing a
# photo from the source removes it from the site, and nothing stale is served
# from a previous run.
EVENT_PHOTOS = [
    ("WhatsApp-Image-2025-09-04-at-09.10.20.png", "IIT Indore"),
    ("WhatsApp Image 2025-09-10 at 11.03.12 (1).jpeg", "Presenting to the panel"),
    ("WhatsApp Image 2025-09-10 at 11.03.11.jpeg", "Open to questions"),
]

# Regions blurred before publishing, keyed by source filename, as fractions of
# width/height so they survive any resize.
#
# The stage photograph shows the closing slide, which prints both teammates'
# institute email addresses — once under each portrait and again in the footer.
# At 4160px wide they are perfectly legible. Harsh's own address is already
# public on his CV; Mayuri Jalin's is not his to publish, and a scraped address
# cannot be recalled. Blur the text, keep the photograph.
REDACTIONS = {
    "WhatsApp Image 2025-09-10 at 11.03.11.jpeg": [
        (0.512, 0.460, 0.801, 0.491),   # both addresses beneath the portraits
        (0.541, 0.541, 0.769, 0.570),   # the footer line
    ],
}


def _redact(im, regions):
    """Blur the given fractional regions beyond recovery."""
    from PIL import ImageFilter

    w, h = im.size
    for x0, y0, x1, y1 in regions:
        box = (int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h))
        patch = im.crop(box)
        # Radius scales with region size so the result is unreadable at any width.
        radius = max(6, (box[2] - box[0]) // 22)
        im.paste(patch.filter(ImageFilter.GaussianBlur(radius)), box)
    return im


def photos(src_dir, out_dir):
    for i, (name, _caption) in enumerate(EVENT_PHOTOS, 1):
        p = os.path.join(src_dir, name)
        if not os.path.exists(p):
            print(f"   !! missing: {name}", file=sys.stderr)
            continue
        im = Image.open(p).convert("RGB")
        if name in REDACTIONS:
            im = _redact(im, REDACTIONS[name])
            print(f"   (redacted {len(REDACTIONS[name])} region(s) in {name})")
        # Colour, not monochrome.
        _save(_fit(im, 1800), os.path.join(out_dir, f"event-{i}.jpg"))
        print(f"   event-{i}.jpg  <- {name}")


def work(src_dir, out_dir):
    # Proof-of-result screenshots that are Harsh's own.
    wanted = {
        "Equity Research | IITG/Unstop result.png": "udgam-result.jpg",
    }
    for rel, out in wanted.items():
        p = os.path.join(src_dir, rel)
        if not os.path.exists(p):
            print(f"   !! missing: {rel}", file=sys.stderr)
            continue
        im = Image.open(p).convert("RGB")
        _save(_mono(_fit(im, 1400), contrast=1.05), os.path.join(out_dir, out))
        print(f"   {out}")


if __name__ == "__main__":
    mode = sys.argv[1]
    {
        "cover": cover,
        "thumb": thumb,
        "portrait": portrait,
        "background": background,
        "photos": photos,
        "work": work,
    }[mode](
        sys.argv[2], sys.argv[3]
    )
