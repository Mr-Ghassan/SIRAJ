#!/usr/bin/env python3
"""Shrink a Chromium-exported PDF: downscale embedded raster images and re-encode as JPEG; text stays vector.
usage: python3 tools/compress-pdf.py in.pdf out.pdf [max_px=2000] [quality=82]

v1.0.1 (2026-10-15): the v1.0 guide shipped with two images that no longer rendered (pages 6 and 19: a broken xref
to a shared colour-profile stream and a truncated soft-masked image). Two safeguards:
  1. images that carry transparency (an /SMask or /Mask, or an alpha mode) are never re-encoded;
  2. identical objects are still merged, but objects are never dropped as "orphans", so shared ICC profiles and masks
     keep every reference they need.
The build then verifies the result page by page (tools/build-guidelines.js → verifyPdf)."""
import sys
from pypdf import PdfWriter
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
max_px = int(sys.argv[3]) if len(sys.argv) > 3 else 2000
q = int(sys.argv[4]) if len(sys.argv) > 4 else 82
w = PdfWriter(clone_from=src)
skipped = replaced = 0
for page in w.pages:
    for img in page.images:
        try:
            obj = img.indirect_reference.get_object() if img.indirect_reference else {}
            if '/SMask' in obj or '/Mask' in obj:
                skipped += 1
                continue  # soft-masked / masked image: keep it byte-for-byte
            im = img.image
            if im.mode in ('RGBA', 'LA', 'P', 'PA'):
                skipped += 1
                continue  # transparency-bearing image: keep it untouched
            if max(im.size) > max_px:
                im.thumbnail((max_px, max_px), Image.LANCZOS)
            img.replace(im.convert('RGB'), quality=q)
            replaced += 1
        except Exception as e:  # an image that cannot be decoded is left exactly as it was
            print(f'compress-pdf: kept image as-is ({type(e).__name__}: {e})', file=sys.stderr)
w.compress_identical_objects(remove_identicals=True, remove_orphans=False)
with open(dst, 'wb') as f:
    w.write(f)
print(f'compress-pdf: {replaced} images re-encoded, {skipped} masked images kept')
