#!/usr/bin/env bash
# Key real silk footage shot on chroma green into a VP9 + alpha WebM (Chromium plays it with transparency).
#   bash tools/silk-footage-key.sh <green-master.mp4> <out_alpha.webm> [key colour 0xRRGGBB] [width]
# Masters are 4K (client rule 2026-10-13: close-ups use high-resolution footage); the composition proxy is scaled to
# <width> (default 1920 for 16:9, use 1080 for 9:16). despill removes green reflected in the satin; the grade
# (hue +5°, saturation 0.6, gamma 0.8) brings the satin onto SIRAJ wine-maroon #602733 with no yellow cast.
set -e
IN=$1; OUT=$2; KEY=${3:-0x15972E}; WID=${4:-1920}; GRADE=${SILK_GRADE:-hue=h=5:s=0.6,eq=gamma=0.8:contrast=1.04}   # per-clip grade onto SIRAJ maroon
ffmpeg -v error -y -i "$IN" -an \
  -vf "scale=${WID}:-2:flags=lanczos,chromakey=${KEY}:0.14:0.05,despill=type=green:mix=0.6:expand=0.05,format=yuva444p,${GRADE},format=yuva420p" \
  -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 20 -row-mt 1 -auto-alt-ref 0 -metadata:s:v:0 alpha_mode=1 "$OUT"
echo "keyed $OUT"
