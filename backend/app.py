from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uuid
import shutil
import os
import asyncio

from audio_utils import (
    text_to_speech,
    speech_to_text,
    generate_conversation_response,
    evaluate_child_response,
)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
UPLOAD_DIR = "uploads"
AUDIO_DIR = "audio"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)

app.mount("/audio", StaticFiles(directory="audio"), name="audio")

# In-memory session storage
sessions = {}


@app.post("/start-session")
async def start_session():
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "history": []
    }

    # First AI greeting
    ai_text = generate_conversation_response(
        session_id=session_id,
        child_text=None,
        sessions=sessions
    )

    audio_path = text_to_speech(ai_text)

    return {
        "session_id": session_id,
        "message": ai_text,
        "audio_url": f"http://localhost:8000/{audio_path}"
    }


@app.post("/send-audio")
async def send_audio(
    session_id: str = Form(...),
    file: UploadFile = File(...)
):
    if session_id not in sessions:
        return {"error": "Invalid session ID"}

    file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}.wav")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 1️⃣ Convert speech to text
    child_text = speech_to_text(file_path)

    # 2️⃣ Generate AI conversation response
    ai_text = generate_conversation_response(
        session_id=session_id,
        child_text=child_text,
        sessions=sessions
    )

    # 3️⃣ Evaluate child response
    evaluation = evaluate_child_response(child_text)

    # 4️⃣ Convert AI response to speech
    audio_path = text_to_speech(ai_text)

    return {
        "child_text": child_text,
        "ai_message": ai_text,
        "evaluation": evaluation,
        "audio_url": f"http://localhost:8000/{audio_path}"
    }

@app.post("/test")
async def test(
    session_id: str = Form(...),
    file: UploadFile = File(...)
):
    # if session_id not in sessions:
    #     return {"error": "Invalid session ID"}
    
    # wait 5 seconds
    await asyncio.sleep(3)
    evaluation={
        "errors": ["this is error"],
        "explanation": "this is explanation",
        "corrected_sentence": "this is corrected response"
    }
    
    return {
        "child_text": "hi there",
        "ai_message": "Hello, how are you?",
        "evaluation": evaluation,
        "audio_url": f"http://localhost:8000/audio\\2ad632f3-2c55-4cda-9f47-21819aff8f96.mp3" 
    }
        