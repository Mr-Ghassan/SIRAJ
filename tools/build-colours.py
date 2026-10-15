#!/usr/bin/env python3
"""Build SIRAJ colour deliverables: palette JSON, Adobe ASE (RGB + CMYK), GIMP/Inkscape GPL, CSV.
Source of HEX values: 09-Design-System/tokens/siraj.tokens.json. Print values are tuned starting points."""
import json, struct, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "02-Colours"
T = json.loads((ROOT / "09-Design-System/tokens/siraj.tokens.json").read_text())

# name, token path, role, CMYK (FOGRA39 coated starting values), Pantone recommendation, tier
SPEC = [
  ("SIRAJ Maroon",      "color.brand.primary",  "Primary — logo, headlines, key surfaces", (34, 89, 58, 47), "PANTONE 7421 C (nearest) · alt. 504 C", "Official"),
  ("SIRAJ Deep",        "color.brand.deep",     "Dark environment, gradient base",          (50, 85, 70, 80), "PANTONE 4975 C (nearest)", "Official"),
  ("SIRAJ Sand",        "color.brand.sand",     "Reversed logo, light-on-dark type",        (14, 24, 27, 0),  "PANTONE 4755 C (nearest) · alt. 7604 C", "Official"),
  ("Architectural Stone","color.brand.stone",   "Lumen accent, rules, fine detail",         (31, 41, 49, 7),  "PANTONE 7530 C (nearest)", "Official"),
  ("SIRAJ Shadow",      "color.brand.shadow",   "Cinema black, deepest silk shadow",        (60, 80, 70, 88), "PANTONE Black 5 C (nearest)", "Extended"),
  ("Silk Highlight",    "color.silk.highlight", "Specular sheen on silk",                   (18, 42, 30, 4),  "PANTONE 5005 C (nearest)", "Silk"),
  ("Silk Midtone",      "color.silk.midtone",   "Lit fold",                                 (30, 80, 52, 30), "PANTONE 7650 C (nearest)", "Silk"),
  ("Silk Dark",         "color.silk.dark",      "Turning fold",                             (42, 90, 65, 62), "PANTONE 7421 C at 100% + 4975 C overprint", "Silk"),
  ("Warm Ivory",        "color.neutral.ivory",  "Default light background",                 (2, 4, 6, 0),     "PANTONE 9224 C (nearest) · or uncoated warm white stock", "Neutral"),
  ("Linen",             "color.neutral.linen",  "Secondary light surface",                  (5, 8, 11, 0),    "PANTONE 7527 C at 30% (nearest)", "Neutral"),
  ("Warm Grey",         "color.neutral.warm-grey","Borders, large secondary type",          (42, 43, 45, 15), "PANTONE Warm Gray 9 C (nearest)", "Neutral"),
  ("Ash",               "color.neutral.ash",    "Secondary text",                           (50, 50, 52, 35), "PANTONE 405 C (nearest)", "Neutral"),
  ("Graphite",          "color.neutral.graphite","Body text on light",                      (62, 64, 58, 62), "PANTONE 432 C (warm alt. Black 7 C)", "Neutral"),
  ("Near Black",        "color.neutral.near-black","Headlines, dark UI chrome",             (70, 70, 65, 85), "PANTONE Black 6 C (nearest)", "Neutral"),
  ("Pure White",        "color.neutral.white",  "Paper, UI surfaces",                       (0, 0, 0, 0),     "— (paper white)", "Neutral"),
]

def get(path):
    node = T
    for p in path.split("."):
        node = node[p]
    return node["$value"]

def rgb(h):
    h = h.lstrip("#"); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def lum(h):
    def f(c):
        c /= 255; return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = rgb(h); return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)

def contrast(a, b):
    x, y = sorted([lum(a), lum(b)], reverse=True); return round((x + 0.05) / (y + 0.05), 2)

palette = []
for name, path, role, cmyk, pms, tier in SPEC:
    hx = get(path).upper()
    palette.append({
        "name": name, "token": path, "tier": tier, "role": role, "hex": hx, "rgb": rgb(hx),
        "cmyk": cmyk, "pantone": pms,
        "contrast": {"on_ivory": contrast(hx, "#F7F2ED"), "on_white": contrast(hx, "#FFFFFF"), "on_maroon": contrast(hx, "#602733"), "on_deep": contrast(hx, "#2C0F12")},
    })

hierarchy = {
  "light_environment": [["Warm Ivory / White", 60], ["SIRAJ Maroon", 18], ["Graphite (text)", 12], ["Linen / Sand", 7], ["Architectural Stone", 3]],
  "dark_environment":  [["SIRAJ Shadow / Deep", 55], ["SIRAJ Maroon (incl. silk)", 25], ["SIRAJ Sand", 12], ["Warm Ivory (text)", 5], ["Architectural Stone", 3]],
}
OUT.mkdir(exist_ok=True)
(OUT / "SIRAJ_Colour-Palette_v1.0.json").write_text(json.dumps({"version": "1.0.0", "palette": palette, "hierarchy": hierarchy,
  "note": "Approved values. For each new print supplier, match CMYK/Pantone to a physical drawdown as standard production practice.",
  "status": "APPROVED — colour values (HEX, RGB, CMYK, Pantone) approved by SIRAJ, 2026-10-11."}, indent=2, ensure_ascii=False) + "\n")

# ---- Adobe Swatch Exchange ----------------------------------------------------
def ase(entries, model):
    blocks = b""
    group = "SIRAJ v1.0"
    def name_bytes(n):
        n = n + "\0"; return struct.pack(">H", len(n)) + n.encode("utf-16-be")
    gb = name_bytes(group); blocks += struct.pack(">HI", 0xC001, len(gb)) + gb
    for e in entries:
        nb = name_bytes(e["name"])
        if model == "RGB ":
            vals = struct.pack(">3f", *[c / 255 for c in e["rgb"]])
        else:
            vals = struct.pack(">4f", *[c / 100 for c in e["cmyk"]])
        body = nb + model.encode() + vals + struct.pack(">H", 0 if e["tier"] in ("Official",) else 2)
        blocks += struct.pack(">HI", 0x0001, len(body)) + body
    blocks += struct.pack(">HI", 0xC002, 0)
    return b"ASEF" + struct.pack(">HHI", 1, 0, len(entries) + 2) + blocks

(OUT / "SIRAJ_Colours_RGB_v1.0.ase").write_bytes(ase(palette, "RGB "))
(OUT / "SIRAJ_Colours_CMYK_v1.0.ase").write_bytes(ase(palette, "CMYK"))

gpl = "GIMP Palette\nName: SIRAJ v1.0\nColumns: 5\n#\n" + "".join(f"{e['rgb'][0]:3d} {e['rgb'][1]:3d} {e['rgb'][2]:3d}\t{e['name']} {e['hex']}\n" for e in palette)
(OUT / "SIRAJ_Colours_v1.0.gpl").write_text(gpl)
csv = "name,tier,hex,r,g,b,c,m,y,k,pantone,contrast_on_ivory,contrast_on_deep\n" + "".join(
  f"\"{e['name']}\",{e['tier']},{e['hex']},{','.join(map(str, e['rgb']))},{','.join(map(str, e['cmyk']))},\"{e['pantone']}\",{e['contrast']['on_ivory']},{e['contrast']['on_deep']}\n" for e in palette)
(OUT / "SIRAJ_Colours_v1.0.csv").write_text(csv)
print("colours:", len(palette))

# ---- v1.0.1: CSS variables (one canonical name per colour; same values as the JSON, ASE, GPL and CSV) --------------
SLUG = {"SIRAJ Maroon": "maroon", "SIRAJ Deep": "deep", "SIRAJ Sand": "sand", "Architectural Stone": "stone",
        "SIRAJ Shadow": "shadow", "Silk Highlight": "silk-highlight", "Silk Midtone": "silk-midtone", "Silk Dark": "silk-dark",
        "Warm Ivory": "ivory", "Linen": "linen", "Warm Grey": "warm-grey", "Ash": "ash", "Graphite": "graphite",
        "Near Black": "near-black", "Pure White": "white"}
css = ["/* SIRAJ Colour System v1.0 — CSS variables. Generated by tools/build-colours.py from",
       "   09-Design-System/tokens/siraj.tokens.json; do not edit by hand. One canonical name per colour.",
       "   Interface tints, functional and dark-UI colours belong to the Design System (design-system/build/siraj-ds.css). */",
       ":root {"]
for tier in ("Official", "Extended", "Silk", "Neutral"):
    css.append(f"  /* {tier} */")
    for p in palette:
        if p["tier"] == tier:
            css.append(f"  --siraj-{SLUG[p['name']]}: {p['hex']}; /* {p['name']} · RGB {' '.join(map(str, p['rgb']))} · CMYK {' '.join(map(str, p['cmyk']))} */")
css += ["  /* Logo-on-black artboard colour (official black of the master artwork) */",
        "  --siraj-artboard-black: #020202;",
        "  /* Gradients: light travelling across silk (02-Colours/README.md) */",
        "  --siraj-g1-silk-light: linear-gradient(51deg, #2C0F12 0%, #602733 100%);",
        "  --siraj-g2-silk-sheen: linear-gradient(118deg, #2C0F12 0%, #602733 42%, #81404C 54%, #602733 66%, #2C0F12 100%);",
        "  --siraj-g3-lumen-glow: radial-gradient(120% 120% at 78% 18%, #81404C 0%, #602733 32%, #2C0F12 78%, #170608 100%);",
        "  --siraj-g4-deep-fall: linear-gradient(180deg, #602733 0%, #2C0F12 62%, #170608 100%);",
        "  --siraj-g5-ivory-light: linear-gradient(51deg, #EFE7E0 0%, #F7F2ED 70%, #FBF8F5 100%);",
        "}", ""]
(OUT / "SIRAJ_Colours_v1.0.css").write_text("\n".join(css))
