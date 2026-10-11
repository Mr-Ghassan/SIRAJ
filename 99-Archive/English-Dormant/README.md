# English · dormant

> **Language policy (official, 2026-10-11):** all SIRAJ communications (the company and the Founding Project «سراج») are in **Arabic only**. English is dormant until SIRAJ launches its first **freehold project open to foreign ownership**, and will be activated for that project.

This folder holds every English deliverable, unchanged and in its original folder structure: social, print, presentations, property marketing, motion, intro, templates and the bilingual PowerPoint template.

**Re-activating English:**

1. `bash tools/archive-english.sh --restore` moves everything back into place.
2. Build with `SIRAJ_EN=1` (motion components and Project Siraj posts render English again). Update `language_policy` in `00-Brand-Foundation/brand.config.json`.

Nothing here should be published while the policy is Arabic-only.
