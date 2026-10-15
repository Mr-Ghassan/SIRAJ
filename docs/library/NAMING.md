# SIRAJ Brand Library — naming convention (v1.0.1)

## Convention

```
SIRAJ_<Asset>_<Variant>_v<version>[_<qualifier>].<ext>
```

- `<Asset>` and `<Variant>` are technical English in PascalCase words joined by hyphens: `Logo`, `Monogram-S`, `Silk`,
  `Drape-Lumen`, `Project-Siraj_KV_Lantern`.
- `<version>` is the asset version (`v1.0`; the guide is `v1.0.1`).
- `<qualifier>` describes an export of the same artwork: a size (`_1024px`), a ratio (`_16x9`), a channel (`_alpha`),
  a role (`_ClearSpace`, `_poster`, `_web`).
- GitHub filenames are English and technical. **Google Drive folders are Arabic** (see `docs/library/DRIVE_STRUCTURE.md`);
  file names stay identical to GitHub so a file can always be traced back to its master.

## Rule for v1.0.1: document, do not rename

Renaming a file breaks every build script, composition, guide page and external link that points to it. In v1.0.1 no
existing file was renamed. Files that do not follow the convention are listed below with the reason; a rename, if wanted,
happens in a later version together with all its references and is recorded in `CHANGELOG.md`.

| Files | Pattern | Reason it is kept |
|---|---|---|
| `01-Logos/Master/Source/SIRAJ_Logo_Source_0N_*.svg`, `SIRAJ_Logo_Master_v1.0.ai` | supplied names | Untouched originals as supplied by SIRAJ (source of record). |
| `01-Logos/PNG/SIRAJ_Monogram-S_<Variant>_<size>px.png` | no `_v1.0` before the size | Existing 1024 px files are referenced by the guide and the build; the v1.0.1 sizes (512/2048/4096) follow the same family pattern so the set stays consistent. Canonical form for a future rename: `SIRAJ_Monogram-S_<Variant>_v1.0_<size>px.png`. |
| `01-Logos/PNG/Favicon/SIRAJ_Favicon*.png/.svg` | no version | Web favicon convention; referenced by size. |
| `05-Graphic-System/Masks/SIRAJ_Mask_*.svg` | no version | Referenced by the graphic-system CSS. |
| `07-Icon-System/svg/*/siraj-icon-<name>.svg`, `sprite/siraj-icons.svg` | kebab-case | Developer convention: file name = icon name = sprite id (`sj-<name>`). |
| `09-Design-System/tokens/build/*`, `design-system/build/*`, `motion-system/tokens/build/*` | platform names | Platform conventions (Swift `SirajTokens.swift`, Kotlin `SirajTokens.kt`, SCSS partial `_siraj-tokens.scss`, JS/TS modules). |
| `14-Property-Marketing/12-Project-Siraj/Source/Architect/*` | architect's names | Supplier source of record (ORIX-WEG, 2026-07). |
| `20-Brand-Guidelines/pages/SIRAJ_Brand-Guidelines_pNN.jpg` | page number | Page previews, regenerated with every guide build. |

Run `python3 -I tools/build-master-library.py` after adding files; `tools/qa-library.py` checks that every declared path exists.
