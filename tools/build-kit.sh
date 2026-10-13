#!/usr/bin/env bash
# Build the ready-to-send packages in 21-Brand-Kit (v1.0, 2026-10-13). Each ZIP maps to one Google Drive folder
# («سراج» → 01 … 07) so it can be uploaded as is. Large films are packed separately so every ZIP stays shareable.
set -e
cd "$(dirname "$0")/.."
OUT=21-Brand-Kit
rm -f $OUT/SIRAJ_*.zip
z() { local name=$1; shift; zip -q -r "$OUT/$name" "$@" -x '*/.DS_Store' -x '*/node_modules/*' -x '01-Logos/Master/Source/*'; }

# 01 · الهوية البصرية الرسمية — identity sources, lettering, colours, type, grids, graphics, silk stills, icons, guidelines
z SIRAJ_01_Brand-Identity_v1.0.zip README.md AGENTS.md BRAND_STATUS.md CHANGELOG.md 00-Brand-Foundation 01-Logos 02-Colours \
  03-Typography 04-Grids 05-Graphic-System 07-Icon-System 06-SIRAJ-Silk/README.md 06-SIRAJ-Silk/Stills 20-Brand-Guidelines/PDF \
  .claude/skills/siraj-brand-system
# 02 · نظام التصميم
z SIRAJ_02_Design-System_v1.0.zip DESIGN_SYSTEM_STATUS.md design-system 09-Design-System docs/qa/DESIGN_SYSTEM_QA.md
# 03 · نظام الحركة والموشن
z SIRAJ_03_Motion-System_v1.0.zip MOTION_SYSTEM_STATUS.md motion-system 15-Motion-System -x '15-Motion-System/Exports/*'
# 04 · الفيديو والافتتاحيات والخواتيم — intro/outro (company + project, 16:9 + 9:16), transitions, components, 4K silk footage
z SIRAJ_04_Video_Intro-Outro_v1.0.zip 16-Intro/Exports 17-Outro/Exports
z SIRAJ_04_Video_Transitions-Components_v1.0.zip 15-Motion-System/Exports
z SIRAJ_04_Video_Silk-Footage-4K_v1.0.zip 06-SIRAJ-Silk/Footage
# 05 · القوالب والمواد التسويقية — social exports, templates, briefs, print, signature
z SIRAJ_05_Templates-Marketing_v1.0.zip 11-Social/Exports 11-Social/Template-Previews 11-Social/Templates 11-Social/Briefs \
  11-Social/Highlights 11-Social/Profile 12-Print 19-Templates
# 06 · المشاريع العقارية — the real project: 4K renders (Luxe Grade), key visuals, posts
z SIRAJ_06_Project-Siraj_v1.0.zip 14-Property-Marketing/12-Project-Siraj -x '14-Property-Marketing/12-Project-Siraj/Source/Architect/*'
# 07 · العروض والمستندات الرسمية — presentation (PPTX, PDF, PNG)
z SIRAJ_07_Presentations_v1.0.zip 13-Presentations
# Claude Design kick-off pack
(cd $OUT && zip -q -r SIRAJ_Claude-Design-Kickoff_v1.0.zip Claude-Design-Kickoff -x '*/.DS_Store')
ls -la $OUT/*.zip
