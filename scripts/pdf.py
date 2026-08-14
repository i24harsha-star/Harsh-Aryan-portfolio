#!/usr/bin/env python3
"""PDF work via macOS CoreGraphics (no ghostscript/poppler on this machine).

  compress <in.pdf> <out.pdf>          re-encode with the system "Reduce File Size" filter
  pages    <in.pdf> <out_dir> <slug> [n]   render the first n pages to JPEG

The source decks are Canva exports carrying full-resolution imagery — 17-27 MB
each. Shipping those as-is would make the site painful to use, so they are
recompressed for the web while the page renders drive the on-site previews.
"""

import os
import sys

import Quartz
from CoreFoundation import CFURLCreateFromFileSystemRepresentation
from PIL import Image

REDUCE_FILTER = "/System/Library/Filters/Reduce File Size.qfilter"


def _url(path):
    return CFURLCreateFromFileSystemRepresentation(
        None, path.encode("utf-8"), len(path.encode("utf-8")), False
    )


def _doc(path):
    doc = Quartz.CGPDFDocumentCreateWithURL(_url(path))
    if doc is None:
        raise SystemExit(f"could not open {path}")
    return doc


def compress(src, out):
    doc = _doc(src)
    n = Quartz.CGPDFDocumentGetNumberOfPages(doc)

    qfilter = Quartz.QuartzFilter.quartzFilterWithURL_(_url(REDUCE_FILTER))
    ctx = Quartz.CGPDFContextCreateWithURL(_url(out), None, None)
    if qfilter is not None:
        qfilter.applyToContext_(ctx)

    for i in range(1, n + 1):
        page = Quartz.CGPDFDocumentGetPage(doc, i)
        box = Quartz.CGPDFPageGetBoxRect(page, Quartz.kCGPDFMediaBox)
        Quartz.CGContextBeginPage(ctx, box)
        Quartz.CGContextDrawPDFPage(ctx, page)
        Quartz.CGContextEndPage(ctx)

    Quartz.CGPDFContextClose(ctx)

    before = os.path.getsize(src) / 1e6
    after = os.path.getsize(out) / 1e6
    print(f"   {os.path.basename(out):<52} {before:6.1f}MB -> {after:5.1f}MB")


def pages(src, out_dir, slug, count=4, width=1400):  # noqa: C901
    count, width = int(count), int(width)
    doc = _doc(src)
    n = min(count, Quartz.CGPDFDocumentGetNumberOfPages(doc))
    os.makedirs(out_dir, exist_ok=True)

    for i in range(1, n + 1):
        page = Quartz.CGPDFDocumentGetPage(doc, i)
        box = Quartz.CGPDFPageGetBoxRect(page, Quartz.kCGPDFMediaBox)
        pw, ph = box.size.width, box.size.height
        if pw <= 0 or ph <= 0:
            continue
        scale = width / pw
        w, h = int(pw * scale), int(ph * scale)

        cs = Quartz.CGColorSpaceCreateDeviceRGB()
        ctx = Quartz.CGBitmapContextCreate(
            None, w, h, 8, w * 4, cs, Quartz.kCGImageAlphaNoneSkipLast
        )
        Quartz.CGContextSetRGBFillColor(ctx, 1, 1, 1, 1)
        Quartz.CGContextFillRect(ctx, Quartz.CGRectMake(0, 0, w, h))
        Quartz.CGContextScaleCTM(ctx, scale, scale)
        Quartz.CGContextDrawPDFPage(ctx, page)

        img = Quartz.CGBitmapContextCreateImage(ctx)
        provider = Quartz.CGImageGetDataProvider(img)
        data = Quartz.CGDataProviderCopyData(provider)
        buf = bytes(data)
        stride = Quartz.CGImageGetBytesPerRow(img)

        im = Image.frombuffer("RGBX", (w, h), buf, "raw", "RGBX", stride, 1).convert("RGB")
        path = os.path.join(out_dir, f"{slug}-p{i}.jpg")
        im.save(path, "JPEG", quality=80, optimize=True, progressive=True)
        print(f"   {slug}-p{i}.jpg")


def flatten(src, out, width=1700, quality=76):
    """Rebuild a PDF from JPEG page renders.

    The Canva decks are visual slides, so rasterising costs almost nothing
    visually and cuts them by ~90%. Text-bearing documents (the CV above all,
    which needs to stay selectable for applicant tracking systems) must NOT go
    through here — keep those as originals.
    """
    doc = _doc(src)
    n = Quartz.CGPDFDocumentGetNumberOfPages(doc)
    frames = []

    for i in range(1, n + 1):
        page = Quartz.CGPDFDocumentGetPage(doc, i)
        box = Quartz.CGPDFPageGetBoxRect(page, Quartz.kCGPDFMediaBox)
        pw, ph = box.size.width, box.size.height
        if pw <= 0 or ph <= 0:
            continue
        scale = min(width / pw, 2.0)
        w, h = max(int(pw * scale), 1), max(int(ph * scale), 1)

        cs = Quartz.CGColorSpaceCreateDeviceRGB()
        ctx = Quartz.CGBitmapContextCreate(
            None, w, h, 8, w * 4, cs, Quartz.kCGImageAlphaNoneSkipLast
        )
        Quartz.CGContextSetRGBFillColor(ctx, 1, 1, 1, 1)
        Quartz.CGContextFillRect(ctx, Quartz.CGRectMake(0, 0, w, h))
        Quartz.CGContextScaleCTM(ctx, scale, scale)
        Quartz.CGContextDrawPDFPage(ctx, page)

        img = Quartz.CGBitmapContextCreateImage(ctx)
        data = Quartz.CGDataProviderCopyData(Quartz.CGImageGetDataProvider(img))
        stride = Quartz.CGImageGetBytesPerRow(img)
        frames.append(
            Image.frombuffer("RGBX", (w, h), bytes(data), "raw", "RGBX", stride, 1)
            .convert("RGB")
        )

    if not frames:
        raise SystemExit(f"no pages rendered from {src}")

    frames[0].save(
        out, "PDF", save_all=True, append_images=frames[1:],
        quality=quality, optimize=True, resolution=150.0,
    )

    before = os.path.getsize(src) / 1e6
    after = os.path.getsize(out) / 1e6
    pct = (1 - after / before) * 100 if before else 0
    print(f"   {os.path.basename(out):<52} {before:6.1f}MB -> {after:5.1f}MB  ({pct:.0f}% smaller)")


if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "compress":
        compress(sys.argv[2], sys.argv[3])
    elif mode == "flatten":
        flatten(sys.argv[2], sys.argv[3])
    elif mode == "pages":
        pages(*sys.argv[2:])
