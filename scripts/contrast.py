#!/usr/bin/env python3
"""Measure WCAG contrast of text over imagery, from a real screenshot.

Eyeballing text on a photograph is unreliable — a scrim can look fine and still
sit at 2.3:1. This reads the rendered pixels instead.

  python3 scripts/contrast.py <shot.png> [top] [bottom] [left] [right]

Reports the ratio between the brightest pixels in the region (the type) and the
darkest (the backdrop). WCAG AA: 4.5:1 body, 3.0:1 large text.
"""
import sys
import numpy as np
from PIL import Image


def luminance(rgb):
    c = rgb / 255.0
    c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]


def main():
    path = sys.argv[1]
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(float)
    t, b, l, r = (int(x) for x in (sys.argv[2:6] or [0, im.height, 0, im.width]))
    band = a[t:b, l:r]
    L = luminance(band)

    text = float(np.percentile(L, 97))
    back = float(np.percentile(L, 30))
    ratio = (max(text, back) + 0.05) / (min(text, back) + 0.05)

    print(f"region      {l},{t} → {r},{b}  of {im.size[0]}x{im.size[1]}")
    print(f"text  (p97) {text:.4f}")
    print(f"back  (p30) {back:.4f}")
    print(f"contrast    {ratio:.2f}:1", end="  ")
    print("PASS body" if ratio >= 4.5 else ("PASS large only" if ratio >= 3.0 else "FAIL"))
    print(f"tonal range std={band.std():.0f} (low = flat/hazy image)")


if __name__ == "__main__":
    main()
