from audio_utils import text_to_speech, speech_to_text, generate_question, evaluate_question
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import shutil
import uuid
import os

app = FastAPI()

# allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
class AskRequest(BaseModel):
    domain: str
    
    

@app.post("/ask")
async def ask_question(req: AskRequest):
    question = generate_question()

    audio_path = text_to_speech(question)
    return {
        "question": question,
        "audio_url": f"http://localhost:8000/{audio_path}"
    }

    
if __name__ == "__main__":
    # Example usage
    text = "Hello, this is a test of the text-to-speech functionality."
    audio_path = ask_question(text)
    print(f"Audio saved to: {audio_path}")

    # Now let's convert it back to text
    transcribed_text = speech_to_text(audio_path)
    print(f"Transcribed text: {transcribed_text}")
    
    