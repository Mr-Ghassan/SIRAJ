#!/usr/bin/env bash
# Create "_Sound" versions of intro/outro MP4s using the SIRAJ sound beds (AAC 256k, 48 kHz).
set -e
cd "$(dirname "$0")/.."
S=15-Motion-System/Sound
for f in 16-Intro/Exports/SIRAJ_Intro_*_v1.0.mp4; do
  case "$f" in *Sound*|*Bilingual*) continue;; esac
  ffmpeg -v error -y -i "$f" -i $S/SIRAJ_Intro_Sound-Bed_6s_v1.0.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest "${f%_v1.0.mp4}_Sound_v1.0.mp4"
done
for f in 17-Outro/Exports/SIRAJ_Outro_*_v1.0.mp4; do
  case "$f" in *Sound*) continue;; esac
  ffmpeg -v error -y -i "$f" -i $S/SIRAJ_Outro_Sound-Bed_5s_v1.0.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest "${f%_v1.0.mp4}_Sound_v1.0.mp4"
done
echo "sound versions muxed"
