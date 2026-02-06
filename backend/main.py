import os
from typing import List
import requests
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PyPDF2 import PdfReader
from dotenv import load_dotenv


app = FastAPI(title="Educational Content Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
SITE_URL = os.getenv("SITE_URL", "http://localhost:3000")
SITE_NAME = os.getenv("SITE_NAME", "Educational Content Assistant")

if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY not set in environment")


DOCUMENT_STORE = {}


class Message(BaseModel):
    role: str  
    content: str


class AskRequest(BaseModel):
    filename: str
    question: str
    history: List[Message] = []


def extract_text_from_pdf(file: UploadFile) -> str:
    reader = PdfReader(file.file)
    full_text = ""

    for page in reader.pages:
        text = page.extract_text()
        if text:
            full_text += text + "\n"

    return full_text.strip()


def chat_with_document(
    document_content: str,
    user_question: str,
    history: List[Message]
) -> str:
    system_message = {
        "role": "system",
        "content": f"""
You are a helpful research assistant.

User has provided a document with the following content:
---
{document_content[:20000]}
---

Answer the user's question primarily using this content.
If the answer is not present, say:
"I couldn't find that in the document."
"""
    }

    messages = [system_message] + \
        [m.model_dump() for m in history] + \
        [{"role": "user", "content": user_question}]

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": SITE_URL,
            "X-Title": SITE_NAME,
            "Content-Type": "application/json",
        },
        json={
            "model": "meta-llama/llama-3.1-8b-instruct",
            "messages": messages,
        },
        timeout=60
    )

    if not response.ok:
        raise HTTPException(
            status_code=500,
            detail=f"OpenRouter API Error: {response.text}"
        )

    data = response.json()
    return data["choices"][0]["message"]["content"]


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    text = extract_text_from_pdf(file)

    if not text:
        raise HTTPException(status_code=400, detail="Could not extract text")

    DOCUMENT_STORE[file.filename] = text

    return {
        "filename": file.filename,
        "characters_extracted": len(text),
        "message": "File uploaded and processed successfully ✅"
    }


@app.post("/ask")
async def ask_question(payload: AskRequest):
    if payload.filename not in DOCUMENT_STORE:
        raise HTTPException(status_code=404, detail="Document not found")

    document_text = DOCUMENT_STORE[payload.filename]

    answer = chat_with_document(
        document_content=document_text,
        user_question=payload.question,
        history=payload.history
    )

    return {
        "answer": answer
    }

@app.get("/")
def health_check():
    return {"status": "Server is running 🚀"}