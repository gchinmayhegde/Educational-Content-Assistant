from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pypdf import PdfReader
import io

app = FastAPI(title="Educational Content Assistant (RAG)")

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

    return JSONResponse({
        "filename": file.filename,
        "characters_extracted": len(text),
        "preview": text[:500]
    })