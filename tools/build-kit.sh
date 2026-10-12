#!/usr/bin/env bash
# Build the ready-to-send packages in 21-Brand-Kit (each under 30 MB so they can be sent in chat or by email).
set -e
cd "$(dirname "$0")/.."
OUT=21-Brand-Kit; T=$(mktemp -d)
cp $OUT/README.md "$T/KIT-README.md"
rm -f $OUT/SIRAJ_Brand-Kit_v1.0_Essentials.zip $OUT/SIRAJ_Project-Siraj_Posts_AR_v1.0.zip
cp "$T/KIT-README.md" KIT-README.md
zip -r -q $OUT/SIRAJ_Brand-Kit_v1.0_Essentials.zip KIT-README.md README.md CHANGELOG.md 00-Brand-Foundation 01-Logos 02-Colours 03-Typography 04-Grids 05-Graphic-System 07-Icon-System 09-Design-System 06-SIRAJ-Silk/README.md -x '01-Logos/Master/Source/*' -x '*/.DS_Store'
zip -q $OUT/SIRAJ_Brand-Kit_v1.0_Essentials.zip 06-SIRAJ-Silk/Stills/*/*_web_v1.0.webp 13-Presentations/PPTX/SIRAJ_Presentation-Template_AR_v1.0.pptx \
  16-Intro/Exports/SIRAJ_Intro_16x9_1920x1080_Sound_v1.0.mp4 16-Intro/Exports/SIRAJ_Intro_9x16_1080x1920_Sound_v1.0.mp4 17-Outro/Exports/SIRAJ_Outro_Logo_16x9_Sound_v1.0.mp4
rm KIT-README.md
mkdir -p "$T/ps/14-Property-Marketing/12-Project-Siraj"
for f in 14-Property-Marketing/12-Project-Siraj/*.png; do
  python3 -c "from PIL import Image; import sys; Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2], quality=92, optimize=True, subsampling=0)" "$f" "$T/ps/${f%.png}.jpg"
done
(cd "$T/ps" && zip -q -r "$OLDPWD/$OUT/SIRAJ_Project-Siraj_Posts_AR_v1.0.zip" 14-Property-Marketing)
rm -rf "$T"; ls -la $OUT
