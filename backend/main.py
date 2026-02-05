from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse

app = FastAPI(title="Educational Content RAG")

@app.get("/")
def root():
    return {"status": "Backend is running 🚀"}

@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    return JSONResponse({
        "filename": file.filename,
        "content_type": file.content_type,
        "message": "File received successfully ✅"
    })