#!/usr/bin/env bash
# Key real silk footage shot on chroma green into a VP9 + alpha WebM (Chromium plays it with transparency).
#   bash tools/silk-footage-key.sh <green-master.mp4> <out_alpha.webm> [key colour 0xRRGGBB]
# The key colour defaults to the measured green of the SIRAJ Ribbon-Pass masters (#22D238).
# despill removes green reflected in the satin; a −9° hue turn keeps the satin on SIRAJ wine-maroon.
set -e
IN=$1; OUT=$2; KEY=${3:-0x22D238}
ffmpeg -v error -y -i "$IN" -an \
  -vf "chromakey=${KEY}:0.16:0.06,despill=type=green:mix=0.55:expand=0.05,format=yuva444p,hue=h=-9:s=0.92,format=yuva420p" \
  -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 22 -row-mt 1 -auto-alt-ref 0 -metadata:s:v:0 alpha_mode=1 "$OUT"
echo "keyed $OUT"
