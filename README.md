# SIRAJ v1.0 — release assets (distribution branch)

This branch only **carries the binary release files** of SIRAJ Brand System v1.0 so they can be fetched from GitHub
(for the Drive upload and the GitHub Release). It shares no history with `main`, is never merged, and holds no source.
Source of truth: `main` at `323431d` (tag to create: `siraj-brand-system-v1.0.0`). Handoff: `docs/HANDOFF_COWORK_v1.0.md`
on branch `feat/siraj-digital-project-experience-v1`.

| Path | Content |
|---|---|
| `whole/` | `SIRAJ_02_Design-System_v1.0.zip`, `SIRAJ_03_Motion-System_v1.0.zip`, `SIRAJ_Brand-Guidelines_v1.0.pdf` (complete files) |
| `parts/` | the 8 larger ZIPs split into ≤ 29 MiB parts (GitHub refuses files over 100 MB) — 28 parts |
| `SIRAJ_v1.0_SHA256SUMS.txt` | the published SHA-256 of all 10 packages (identical to `main`) |
| `join.sh` / `join.ps1` | rebuild the 10 ZIPs into `out/` and verify every checksum |

## Rebuild and verify

```bash
git clone --single-branch --branch release/v1.0-assets https://github.com/Mr-Ghassan/SIRAJ.git siraj-v1.0-assets
cd siraj-v1.0-assets
bash join.sh            # macOS / Linux  → out/ + "OK" for all 10
# Windows: powershell -ExecutionPolicy Bypass -File join.ps1
```

Upload only the rebuilt files from `out/` (never the `.part` files):
- 10 ZIPs (+ `SIRAJ_v1.0_SHA256SUMS.txt`) → Drive «سراج / 08 ـ حزم الإصدارات والأرشيف / 01 ـ الإصدار الرسمي v1.0 / 02 ـ حزم ZIP»
- `whole/SIRAJ_Brand-Guidelines_v1.0.pdf` → Drive «سراج / 01 ـ الهوية البصرية الرسمية / 02 ـ دليل الهوية الرسمي»
- all of the above → GitHub Release `siraj-brand-system-v1.0.0` on `323431d`

Do not rebuild the packages with `tools/build-kit.sh`: a rebuild changes file timestamps and no longer matches the published sums.
Once the Release and the Drive upload are confirmed, this branch can be deleted by the owner (it is only a carrier).
