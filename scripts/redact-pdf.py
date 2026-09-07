#!/usr/bin/env python3
"""Remove other people's contact details from the PDFs published in public/docs.

WHY THIS EXISTS
---------------
Five of the case decks are team work, and the team's slide template printed
BOTH teammates' institute email addresses in a footer on most pages. Publishing
Harsh's own address is his decision to make. Publishing his teammate's is not
his decision to make, and under the Digital Personal Data Protection Act, 2023
it is the processing of someone else's personal data without their consent.

The decks are rasterised — every page is one flat JPEG — so the addresses are
invisible to text search and to every "check the PDF for emails" script, while
being perfectly legible to any human who opens the file. That is the worst
combination: undetectable by tooling, fully exposed to readers and to anyone
running OCR at scale to harvest addresses.

WHAT IT DOES
------------
Finds every email address in a PDF — in the text layer where there is one, and
by OCR where the page is an image — and destroys the pixels of any address that
is not on the OWN_ADDRESSES allowlist.

Destroys, not covers. Drawing a black box over an image leaves the original
pixels underneath, recoverable by anyone who extracts the embedded image. This
rewrites the embedded JPEG itself, so the glyphs are gone from the file.

WHOSE DATA IS WHOSE
-------------------
Only addresses that are NOT Harsh's are touched. His own institute address and
phone number are left exactly where they are: those are his to publish or not,
and that decision is deliberately not automated here. See handoff.md §6.

USAGE
-----
    python3 scripts/redact-pdf.py public/docs/*.pdf          # redact in place
    python3 scripts/redact-pdf.py --check public/docs/*.pdf  # report only, exit 1 if any found

DEPENDENCIES
------------
    pip install pymupdf pytesseract pillow
    brew install tesseract        # macOS
    apt-get install tesseract-ocr # Debian/Ubuntu

The script exits non-zero if a dependency is missing rather than skipping the
work, so a pipeline that regenerates the decks fails loudly instead of quietly
republishing the address.
"""

import io
import os
import re
import sys

try:
    import pymupdf
    import pytesseract
    from PIL import Image, ImageFilter
except ImportError as exc:  # pragma: no cover - environment problem, not logic
    sys.exit(
        f"redact-pdf: missing dependency ({exc.name}).\n"
        "  pip install pymupdf pytesseract pillow\n"
        "  brew install tesseract   (or: apt-get install tesseract-ocr)\n"
        "Refusing to continue — silently skipping this step would republish a "
        "third party's email address."
    )

EMAIL = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")

# Addresses belonging to Harsh. These are left alone: whether to publish his own
# contact details is his call, and this script does not make it for him.
OWN_ADDRESSES = {
    "harsh.aryan.finance@gmail.com",
    "i24harsha@iimidr.ac.in",
}

# Padding around a detected address, as a fraction of its own height. OCR boxes
# hug the glyphs; a little margin makes sure no ascender or descender survives.
PAD = 0.35


def _is_foreign(address: str) -> bool:
    return address.strip().lower().rstrip(".,;:|") not in OWN_ADDRESSES


def _destroy(img: Image.Image, boxes) -> Image.Image:
    """Pixelate then blur each box, in place, irreversibly.

    Pixelation alone can leave letter-shaped blocks that a human can still read;
    a blur alone can sometimes be partially inverted. Downsampling to a few
    pixels first throws the information away, and the blur removes the blocky
    edge that would otherwise advertise the redaction.
    """
    for x0, y0, x1, y1 in boxes:
        x0, y0 = max(0, int(x0)), max(0, int(y0))
        x1, y1 = min(img.width, int(x1)), min(img.height, int(y1))
        if x1 <= x0 or y1 <= y0:
            continue
        region = img.crop((x0, y0, x1, y1))
        small = region.resize(
            (max(1, region.width // 24), max(1, region.height // 10)), Image.BILINEAR
        )
        region = small.resize(region.size, Image.NEAREST).filter(ImageFilter.GaussianBlur(6))
        img.paste(region, (x0, y0))
    return img


def _ocr_boxes(img: Image.Image):
    """Return (box, address) for every foreign email address OCR can see."""
    # OCR is far more reliable on a large, high-contrast image. These pages are
    # 1700px wide; doubling that is what makes small footer type readable.
    scale = 2
    big = img.resize((img.width * scale, img.height * scale), Image.LANCZOS)
    data = pytesseract.image_to_data(big, output_type=pytesseract.Output.DICT)

    found = []
    for i, word in enumerate(data["text"]):
        if "@" not in word:
            continue
        match = EMAIL.search(word)
        if not match or not _is_foreign(match.group()):
            continue
        x, y = data["left"][i] / scale, data["top"][i] / scale
        w, h = data["width"][i] / scale, data["height"][i] / scale
        pad = h * PAD
        found.append(((x - pad, y - pad, x + w + pad, y + h + pad), match.group()))
    return found


def _redact_image_page(doc, page, report):
    """A rasterised page: rewrite the embedded image with the address destroyed."""
    images = page.get_images(full=True)
    if len(images) != 1:
        # Every deck page produced by the flatten step is a single full-page
        # JPEG. Anything else is unexpected and should be looked at by hand
        # rather than guessed at.
        if images:
            report.append(
                f"    page {page.number + 1}: {len(images)} images, not the expected 1 — "
                "skipped, inspect by hand"
            )
        return False

    xref = images[0][0]
    raw = doc.extract_image(xref)
    img = Image.open(io.BytesIO(raw["image"])).convert("RGB")

    hits = _ocr_boxes(img)
    if not hits:
        return False

    _destroy(img, [b for b, _ in hits])

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=82, optimize=True, progressive=True)
    page.replace_image(xref, stream=buf.getvalue())

    for _, address in hits:
        report.append(f"    page {page.number + 1}: destroyed {address} (image)")
    return True


def _redact_text_page(page, report):
    """A page with a real text layer: a true PDF redaction removes the glyphs."""
    changed = False
    for word in page.get_text("words"):
        match = EMAIL.search(word[4])
        if not match or not _is_foreign(match.group()):
            continue
        page.add_redact_annot(pymupdf.Rect(word[:4]), fill=(0.85, 0.85, 0.85))
        report.append(f"    page {page.number + 1}: redacted {match.group()} (text)")
        changed = True
    if changed:
        page.apply_redactions()
    return changed


def scan(path, check_only=False):
    doc = pymupdf.open(path)
    report, changed = [], False

    for page in doc:
        if page.get_text().strip():
            hit = _redact_text_page(page, report) if not check_only else _find_text(page, report)
        else:
            hit = (
                _redact_image_page(doc, page, report)
                if not check_only
                else _find_image(page, doc, report)
            )
        changed = changed or hit

    if changed and not check_only:
        # PyMuPDF refuses a non-incremental save over a file it still has open,
        # and an incremental save would append the new image while leaving the
        # old one in the file — the address would still be extractable. Write a
        # fresh document beside it and swap, so the original bytes never survive.
        tmp = f"{path}.redacting"
        doc.save(tmp, deflate=True, garbage=4)
        doc.close()
        os.replace(tmp, path)
        return report

    doc.close()
    return report


def _find_text(page, report):
    hits = [
        m.group()
        for w in page.get_text("words")
        if (m := EMAIL.search(w[4])) and _is_foreign(m.group())
    ]
    report.extend(f"    page {page.number + 1}: FOUND {a} (text)" for a in hits)
    return bool(hits)


def _find_image(page, doc, report):
    images = page.get_images(full=True)
    if len(images) != 1:
        return False
    img = Image.open(io.BytesIO(doc.extract_image(images[0][0])["image"])).convert("RGB")
    hits = _ocr_boxes(img)
    report.extend(f"    page {page.number + 1}: FOUND {a} (image)" for _, a in hits)
    return bool(hits)


def main(argv):
    check_only = "--check" in argv
    paths = [a for a in argv if not a.startswith("--")]
    if not paths:
        sys.exit(__doc__)

    total = 0
    for path in paths:
        report = scan(path, check_only)
        verb = "found in" if check_only else "redacted"
        if report:
            total += len(report)
            print(f"  {verb} {path}")
            print("\n".join(report))
        else:
            print(f"  clean   {path}")

    if check_only and total:
        print(
            f"\n{total} address(es) belonging to someone other than Harsh are still "
            "published. Run without --check to remove them."
        )
        return 1
    if not check_only:
        print(f"\n{total} address(es) destroyed." if total else "\nNothing to redact.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
