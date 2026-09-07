#!/usr/bin/env python3
"""WCAG contrast for the design tokens, computed from the token values themselves.

scripts/contrast.py measures a real screenshot and is the final word on text sitting
over a photograph. This one measures the palette *before* anything is rendered, so a
token that can never pass is caught at the point it is chosen rather than after it has
been used in forty places.

Usage:  python3 scripts/contrast-tokens.py
Exit code 1 if any pairing marked required=True fails its threshold.
"""
import re
import sys
from pathlib import Path

CSS = Path(__file__).resolve().parent.parent / "src" / "app" / "globals.css"


def srgb_to_linear(c: float) -> float:
    c /= 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(rgb) -> float:
    r, g, b = (srgb_to_linear(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(fg, bg) -> float:
    a, b = luminance(fg), luminance(bg)
    lo, hi = sorted((a, b))
    return (hi + 0.05) / (lo + 0.05)


def over(fg, alpha: float, bg):
    """Composite fg at `alpha` over bg. Browsers blend in gamma space, so this does too."""
    return tuple(alpha * f + (1 - alpha) * b for f, b in zip(fg, bg))


def hex_rgb(h: str):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def read_tokens() -> dict:
    """Pull the token values out of globals.css so this can never drift from the source."""
    css = CSS.read_text()
    root = css.split(":root {", 1)[1].split("\n}", 1)[0]
    out = {}
    for name, value in re.findall(r"--([\w-]+):\s*([^;]+);", root):
        value = value.strip()
        if m := re.fullmatch(r"#([0-9a-fA-F]{6})", value):
            out[name] = hex_rgb(m.group(1))
        elif m := re.fullmatch(r"rgba\(([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\)", value):
            r, g, b, a = (float(x) for x in m.groups())
            out[name] = ((r, g, b), a)
    return out


def main() -> int:
    t = read_tokens()
    bg = t["bg"]
    raised = t["bg-raised"]
    # The case cards paint their own solid background rather than using a token.
    card = hex_rgb("101010")

    def resolve(name, ground):
        v = t[name]
        return over(v[0], v[1], ground) if isinstance(v[0], tuple) else v

    # required=True means real text renders in this colour, so AA applies.
    #   4.5 = normal text · 3.0 = large text (>=24px, or >=18.66px bold) and UI boundaries
    checks = [
        ("--fg      on --bg", resolve("fg", bg), bg, 4.5, True),
        ("--fg-muted on --bg", resolve("fg-muted", bg), bg, 4.5, True),
        ("--fg-faint on --bg", resolve("fg-faint", bg), bg, 4.5, True),
        ("--fg-faint on #101010 (case card)", resolve("fg-faint", card), card, 4.5, True),
        ("--fg-muted on --bg-raised", resolve("fg-muted", raised), raised, 4.5, True),
        ("--accent  on --bg (link/hover text)", resolve("accent", bg), bg, 4.5, True),
        ("--accent  on --bg (focus ring, non-text)", resolve("accent", bg), bg, 3.0, True),
        ("--line-strong on --bg (control border)", resolve("line-strong", bg), bg, 3.0, True),
        ("--line    on --bg (decorative rule)", resolve("line", bg), bg, 3.0, False),
    ]

    worst_fail = 0
    print(f"ground: --bg {bg}\n")
    for label, fg, ground, need, required in checks:
        r = ratio(fg, ground)
        ok = r >= need
        mark = "PASS" if ok else ("FAIL" if required else "warn")
        if not ok and required:
            worst_fail += 1
        print(f"  [{mark}] {label:<40} {r:5.2f}:1  (needs {need})")

    print()
    if worst_fail:
        print(f"{worst_fail} required pairing(s) below threshold.")
        return 1
    print("All required pairings meet WCAG 2.2 AA.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
