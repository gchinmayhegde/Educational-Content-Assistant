from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pypdf import PdfReader
import io

app = FastAPI(title="Educational Content Assistant (RAG)")

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50):
    """
    Splits text into overlapping chunks.
    """
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - overlap

    return chunks

@app.get("/")
def root():
    return {"status": "Backend is running 🚀"}

@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    text = ""

    if file.content_type == "application/pdf":
        pdf_bytes = file.file.read()
        reader = PdfReader(io.BytesIO(pdf_bytes))

        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text

    elif file.content_type == "text/plain":
        text = file.file.read().decode("utf-8")

    else:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and TXT files are supported"
        )

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="No extractable text found in the file"
        )

    chunks = chunk_text(text)

    return JSONResponse({
        "filename": file.filename,
        "total_characters": len(text),
        "total_chunks": len(chunks),
        "sample_chunks": chunks[:3]
    })