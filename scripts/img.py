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


def cover(src, out):
    im = Image.open(src).convert("RGB")
    # The team decks carry a footer strip with both teammates' email addresses.
    # Trim it so the cover art can be shown without publishing personal contacts.
    im = im.crop((0, 0, im.width, int(im.height * 0.93)))
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


# Curated, in display order. The source folder also holds a tighter crop of the
# venue shot and two weaker frames; these are the ones worth showing. Chosen by
# hand rather than by heuristic — they are how Harsh is presented publicly.
EVENT_PHOTOS = [
    ("WhatsApp Image 2025-09-04 at 09.10.20.jpeg", "Arriving at IIT Indore"),
    ("WhatsApp Image 2025-09-10 at 11.03.12 (1).jpeg", "Presenting to the panel"),
    ("WhatsApp Image 2025-09-10 at 11.03.11.jpeg", "On stage"),
    ("WhatsApp Image 2025-09-04 at 09.10.27.jpeg", "Case materials"),
]


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


def photos(src_dir, out_dir):
    for i, (name, _caption) in enumerate(EVENT_PHOTOS, 1):
        p = os.path.join(src_dir, name)
        if not os.path.exists(p):
            print(f"   !! missing: {name}", file=sys.stderr)
            continue
        im = Image.open(p).convert("RGB")
        _save(_mono(_fit(im, 1600)), os.path.join(out_dir, f"event-{i}.jpg"))
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
        "portrait": portrait,
        "background": background,
        "photos": photos,
        "work": work,
    }[mode](
        sys.argv[2], sys.argv[3]
    )
