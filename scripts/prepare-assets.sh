#!/usr/bin/env bash
# Prepare web assets from the raw "Website Assets" folder.
#
# Only Harsh's OWN work is copied into public/. Third-party material that lives
# in the source folder (company annual reports, broker research notes, organiser
# problem statements and rulebooks, a teammate's certificate) is deliberately
# excluded — republishing it would be copyright infringement.
#
# Safe to re-run: it overwrites, never deletes.

set -euo pipefail

SRC="/Users/harsharyan/Files/Work/Projects/Portfolio/Website Assets"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCS="$ROOT/public/docs"
IMG="$ROOT/public/img"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$DOCS" "$IMG/covers" "$IMG/photos" "$IMG/work"

say() { printf '\033[1m%s\033[0m\n' "$*"; }

# ---------------------------------------------------------------------------
# 1. Documents — Harsh's own decks, reports and CV
# ---------------------------------------------------------------------------
say "→ copying documents"

copy_doc() { # <relative source> <output name>
  if [ -f "$SRC/$1" ]; then
    cp "$SRC/$1" "$DOCS/$2"
    echo "   $2"
  else
    echo "   !! missing: $1" >&2
  fi
}

copy_doc "Equity Research | IITG/WhiteRock  Equity Research Challenge - UDGAM'26  IITG copy.pdf" "udgam-iitg-equity-research.pdf"
copy_doc "Case Chronicles | E-Summit | IITI/WhiteRock  IIMI  Case Chronicles E-Summit'25 IITI.pdf" "case-chronicles-iiti.pdf"
copy_doc "Case-O-Nova | IIMB/2nd Dec/WhiteRock_IIMIndore_Final.pdf" "case-o-nova-iimb.pdf"
copy_doc "CaseCon | ABV-IIIT Infotsav'25/WhiteRock | CaseCon | ABV-IIIT.pdf" "casecon-abv-iiitm.pdf"
copy_doc "UPAY | Samadhan'25/WhiteRock  UPAY  SAMADHAN'25.pdf" "samadhan-upay.pdf"
copy_doc "UPAY | Samadhan'25/IIM-Indore_WhiteRock_Integrated-Solution.pdf" "samadhan-upay-full-solution.pdf"
copy_doc "How to read Annual Report/How to read Annual Report in 2025 using Pareto analysis.pdf" "how-to-read-an-annual-report.pdf"
copy_doc "Access Livelihoods/3 Lessons - Finance Internship.pdf" "three-lessons-before-your-first-internship.pdf"
copy_doc "Harsh Aryan_Resume.pdf" "harsh-aryan-cv.pdf"

# Models and workbooks
copy_doc "Income Quality of Large Cap Chemicals & Petrochemicals Companies/Accessing the Income Quality of Large Cap Chemicals & Petrochemicals Company.xlsx" "income-quality-chemicals.xlsx"
copy_doc "Monte Carlo simulation/Monte Carlo Simulation.xlsx" "monte-carlo-nifty50.xlsx"
copy_doc "Equity Research | IITG/Company Data/Financial Modelling/Dynacon System & Solutions FSA.xlsx" "dynacons-fsa-model.xlsx"

# ---------------------------------------------------------------------------
# 1b. Shrink the design decks for the web
#
# The Canva exports are 17-28 MB each because they embed full-resolution imagery.
# Rasterising them at web resolution cuts ~90% with no visible loss (they are
# visual slides). Deliberately NOT flattened:
#   harsh-aryan-cv          — must stay selectable text for applicant tracking systems
#   three-lessons           — already 0.1 MB, and it is a text handout
#   udgam-iitg              — a dense research report; flattening saves only 16%
#                             and would cost text selection
# ---------------------------------------------------------------------------
say "→ optimising decks for the web"

for slug in case-chronicles-iiti case-o-nova-iimb casecon-abv-iiitm \
            how-to-read-an-annual-report samadhan-upay samadhan-upay-full-solution; do
  if [ -f "$DOCS/$slug.pdf" ]; then
    /opt/anaconda3/bin/python3 "$ROOT/scripts/pdf.py" flatten "$DOCS/$slug.pdf" "$TMP/$slug.pdf"
    mv "$TMP/$slug.pdf" "$DOCS/$slug.pdf"
  fi
done

# ---------------------------------------------------------------------------
# 2. Deck covers — render page 1 of each PDF
#
# Rendered through CoreGraphics rather than `qlmanage -t`, which silently caps
# thumbnails at whatever the generator prefers (~435px wide here) regardless of
# the -s flag, leaving visibly soft covers at display size.
# ---------------------------------------------------------------------------
say "→ rendering deck covers"

cover() { # <doc filename> <output slug>
  local pdf="$DOCS/$1"
  [ -f "$pdf" ] || return 0
  rm -rf "$TMP/pg"; mkdir -p "$TMP/pg"
  /opt/anaconda3/bin/python3 "$ROOT/scripts/pdf.py" pages "$pdf" "$TMP/pg" page 1 1600 >/dev/null
  local out="$TMP/pg/page-p1.jpg"
  if [ -f "$out" ]; then
    /opt/anaconda3/bin/python3 "$ROOT/scripts/img.py" cover "$out" "$IMG/covers/$2.jpg"
    echo "   $2.jpg"
  else
    echo "   !! cover failed: $1" >&2
  fi
}

cover "udgam-iitg-equity-research.pdf"                 "udgam-iitg"
cover "case-chronicles-iiti.pdf"                       "case-chronicles"
cover "case-o-nova-iimb.pdf"                           "case-o-nova"
cover "casecon-abv-iiitm.pdf"                          "casecon"
cover "samadhan-upay.pdf"                              "samadhan"
cover "how-to-read-an-annual-report.pdf"               "annual-report"
cover "three-lessons-before-your-first-internship.pdf" "three-lessons"
cover "harsh-aryan-cv.pdf"                             "cv"

# ---------------------------------------------------------------------------
# 3. Portrait — monochrome, three widths
# ---------------------------------------------------------------------------
say "→ processing portrait"
/opt/anaconda3/bin/python3 "$ROOT/scripts/img.py" portrait "$SRC/Profile Pic.png" "$IMG"

say "→ processing hero background"
/opt/anaconda3/bin/python3 "$ROOT/scripts/img.py" background "$SRC/Background Pic.png" "$IMG"

# ---------------------------------------------------------------------------
# 4. Event photography — monochrome
# ---------------------------------------------------------------------------
say "→ processing event photos"
/opt/anaconda3/bin/python3 "$ROOT/scripts/img.py" photos "$SRC/Case Chronicles | E-Summit | IITI/Photos" "$IMG/photos"

# ---------------------------------------------------------------------------
# 5. Work artefacts — charts cropped out of their spreadsheet screenshots
# ---------------------------------------------------------------------------
say "→ processing work artefacts"
/opt/anaconda3/bin/python3 "$ROOT/scripts/img.py" work "$SRC" "$IMG/work"

say "done."
