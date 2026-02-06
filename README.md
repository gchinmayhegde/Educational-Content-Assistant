📚 Educational Content Assistant

Educational Content Assistant is a lightweight AI-powered RAG application that allows users to upload educational PDFs and ask questions answered strictly from the document content using an LLM.

Built with FastAPI + React + OpenRouter, optimized to run on low-end hardware.

🚀 Key Features

📄 Upload educational PDF documents
💬 Ask natural-language questions about the document
🧠 AI answers grounded only in uploaded content
🔁 Conversation history support
⚡ Fast, lightweight, and beginner-friendly
💻 Runs on 4GB RAM / Intel i3 systems
🔐 Secure API key handling via backend only

🧠 Architecture Overview

React (Vite) UI
      |
      v
FastAPI Backend
      |
      v
OpenRouter LLM (Llama 3.1 8B)

No databases
No vector DBs
No LangChain
Simple, explainable RAG-style flow

🛠 Tech Stack

Frontend
--React 18
--Vite
--CSS (no heavy UI libraries)

Backend
--FastAPI
--Uvicorn
--PyPDF2
--Requests
--Pydantic
--AI

OpenRouter API

Model: meta-llama/llama-3.1-8b-instruct

⚙️ System Requirements

RAM: 4 GB minimum
CPU: Intel i3 or equivalent
Python: 3.10
Node.js: 16+
OS: Windows / macOS / Linux

📁 Project Structure
educational-content-assistant/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
│
└── README.md
🔑 Environment Setup

Create backend/.env:

OPENROUTER_API_KEY=your_openrouter_api_key_here
SITE_URL=http://localhost:3000
SITE_NAME=Educational Content Assistant

⚠️ Never commit .env to GitHub.

🧪 Backend API Endpoints

1️⃣ Upload PDF

POST /upload

Uploads and stores a PDF.

Request

curl -X POST http://127.0.0.1:8000/upload \
  -F "file=@document.pdf"

Response

{
  "filename": "document.pdf",
  "message": "File uploaded successfully"
}


2️⃣ Ask Question

POST /ask

Ask a question about an uploaded document.

Request

{
  "filename": "document.pdf",
  "question": "What is this document about?",
  "history": []
}

Response

{
  "answer": "The document explains..."
}

🚀 Running the Project
Backend
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload

Backend runs at:
👉 http://127.0.0.1:8000

👉 API docs: http://127.0.0.1:8000/docs

Frontend
cd frontend
npm install
npm run dev

Frontend runs at:
👉 http://localhost:3000

🧠 Usage Flow

Upload a PDF
Ask questions in chat interface
AI responds using document content only
Ask follow-up questions with context

⚠️ Important Notes

Upload must happen before asking
PDF must contain selectable text (not scanned images)
File name must match exactly in /ask
First response may be slower due to model cold start

🧩 Why This Project Matters

Demonstrates real-world RAG design
Clean backend API separation
Proper LLM usage (no prompt leaks)
Beginner-readable, recruiter-friendly
Easy to extend with embeddings later

📌 Possible Future Improvements

Multiple document support
Embeddings + semantic search
Authentication
File storage persistence
Deployment to cloud (Render / Railway)

📄 License

MIT License — free to use, modify, and distribute.

If you like this project, consider giving it a ⭐ on GitHub.