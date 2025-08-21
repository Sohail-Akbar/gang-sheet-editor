# convert_pdf_to_svg.py
import sys
from pdf2svg import pdf2svg

def convert_pdf_to_svg(pdf_file, svg_file):
    pdf2svg(pdf_file, svg_file)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_pdf_to_svg.py <input.pdf> <output.svg>")
        sys.exit(1)
    
    pdf_file = sys.argv[1]
    svg_file = sys.argv[2]
    
    convert_pdf_to_svg(pdf_file, svg_file)
