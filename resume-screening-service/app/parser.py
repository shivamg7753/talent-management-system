# app/parser.py
from pdfminer.high_level import extract_text as pdf2text   # PDF → text
import docx                                                # DOCX → text
import pathlib, re

EMAIL_RE = re.compile(r"[\w\.-]+@[\w\.-]+\.\w+")

def extract_txt(path: pathlib.Path) -> str:
    if path.suffix.lower() == ".pdf":
        return pdf2text(str(path))
    elif path.suffix.lower() in {".docx", ".doc"}:
        doc = docx.Document(str(path))
        return "\n".join(p.text for p in doc.paragraphs)
    elif path.suffix.lower() == ".txt":
        return path.read_text(encoding='utf-8')
    else:
        raise ValueError(f"Unsupported file type: {path.suffix}")

def detect_email(txt: str) -> str | None:
    m = EMAIL_RE.search(txt)
    return m.group(0) if m else None
