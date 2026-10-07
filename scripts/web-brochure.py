"""Make the website's e-brochure from the client's brochure PDF.

    python scripts/web-brochure.py

Reads the client's brochure (`Aranya _E_Brochure 2.pdf`, 11.4 MB) and writes
public/assets/aranya-e-brochure.pdf, the file the "Download E-Brochure" buttons
serve (client, 7 Oct 2026). The save is lossless: unused objects dropped, streams
recompressed, damaged streams repaired. The photos are already 150 dpi JPEGs as
placed, so shrinking them further would show; they are kept byte for byte.
"""

import os
import sys

import fitz  # PyMuPDF

SRC = 'Aranya _E_Brochure 2.pdf'
OUT = 'public/assets/aranya-e-brochure.pdf'


def main():
    if not os.path.exists(SRC):
        sys.exit('Cannot find %s — run from the project root.' % SRC)
    doc = fitz.open(SRC)
    doc.save(OUT, garbage=4, deflate=True, deflate_images=False, deflate_fonts=True, clean=True)
    before, after = os.path.getsize(SRC), os.path.getsize(OUT)
    print('  %s: %.1f MB -> %.1f MB (%d pages)' % (OUT, before / 1e6, after / 1e6, doc.page_count))


if __name__ == '__main__':
    main()
