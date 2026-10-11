#!/usr/bin/env python3
"""Shrink a Chromium-exported PDF: downscale embedded raster images and re-encode as JPEG; text stays vector.
usage: python3 tools/compress-pdf.py in.pdf out.pdf [max_px=2000] [quality=82]"""
import sys, io
from pypdf import PdfReader, PdfWriter
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
max_px = int(sys.argv[3]) if len(sys.argv) > 3 else 2000
q = int(sys.argv[4]) if len(sys.argv) > 4 else 82
w = PdfWriter(clone_from=src)
for page in w.pages:
    for img in page.images:
        try:
            im = img.image
            if im.mode in ("RGBA", "LA", "P"):
                continue  # keep transparency-bearing images untouched
            if max(im.size) > max_px:
                im.thumbnail((max_px, max_px), Image.LANCZOS)
            img.replace(im.convert("RGB"), quality=q)
        except Exception as e:
            pass
w.compress_identical_objects(remove_identicals=True, remove_orphans=True)
with open(dst, "wb") as f:
    w.write(f)
