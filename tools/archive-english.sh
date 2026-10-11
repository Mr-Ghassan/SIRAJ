#!/usr/bin/env bash
# Language policy (00-Brand-Foundation/brand.config.json → language_policy):
# SIRAJ communicates in Arabic. English deliverables are kept DORMANT, not deleted, in
# 99-Archive/English-Dormant/<original path>, until the first freehold project open to foreign ownership.
#   bash tools/archive-english.sh            move English outputs to the dormant archive
#   bash tools/archive-english.sh --dry-run  list what would move
#   bash tools/archive-english.sh --restore  move everything back (when English is re-activated)
set -e
cd "$(dirname "$0")/.."
DST=99-Archive/English-Dormant
if [ "$1" = "--restore" ]; then
  [ -d "$DST" ] || { echo "nothing to restore"; exit 0; }
  (cd "$DST" && find . -type f ! -name README.md) | while read -r f; do mkdir -p "$(dirname "${f#./}")"; mv "$DST/${f#./}" "${f#./}"; done
  echo "English deliverables restored"; exit 0
fi
# Identity, system and reference folders are not communications: logos, type, tokens, UI docs, silk, icons, guidelines, tools.
SKIP='^\./(\.git|node_modules|99-Archive|tools|00-Brand-Foundation|01-Logos|02-Colours|03-Typography|04-Grids|05-Graphic-System|06-SIRAJ-Silk|07-Icon-System|09-Design-System|10-UI-Components|18-3D|20-Brand-Guidelines|15-Motion-System/(components|web|lib|transitions|Sound))/'
list() {
  find . -type f | grep -Ev "$SKIP" | grep -E \
    -e '(^|[_/-])EN([_.-]|$)' \
    -e '_Bilingual-Lockup_' \
    -e 'Stacked-Bilingual' \
    -e 'SIRAJ_Letterhead_Bilingual' \
    -e 'SIRAJ_Presentation-Template_v1\.0\.pptx$' \
  | grep -Ev '(EN-AR|AR-EN)' | grep -v '/README\.md$'
}
n=0
while read -r f; do
  [ -z "$f" ] && continue
  f=${f#./}; n=$((n + 1))
  if [ "$1" = "--dry-run" ]; then echo "$f"; continue; fi
  mkdir -p "$DST/$(dirname "$f")"; mv "$f" "$DST/$f"
done < <(list)
[ "$1" = "--dry-run" ] && echo "$n files would move" || echo "$n English files moved to $DST"
