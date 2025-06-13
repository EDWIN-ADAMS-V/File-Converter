from pdf2docx import Converter
import sys
import os

if len(sys.argv) != 3:
    print("Usage: pdf_to_docx.py input.pdf output.docx")
    sys.exit(1)

input_pdf = sys.argv[1]
output_docx = sys.argv[2]

if not os.path.exists(input_pdf):
    print("Error: Input file does not exist")
    sys.exit(1)

try:
    cv = Converter(input_pdf)
    cv.convert(output_docx)
    cv.close()
    print("success")
except Exception as e:
    print("error:", str(e))
    sys.exit(1)
