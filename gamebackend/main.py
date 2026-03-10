"""FastAPI backend for Drive to the Party! voice recognition."""
import os
import json
import tempfile
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from whisper_service import transcribe
from phrase_matcher import match_phrase

app = FastAPI(title="Drive to the Party! - Voice API")

# CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Checkpoint accepted variants mapping
CHECKPOINT_VARIANTS = {
    "WAITING_START": ["start car", "start the car", "go", "let's go", "start"],
    "WAITING_TREE": ["remove tree", "remove the tree", "clear the tree", "move tree"],
    "WAITING_LEFT": ["turn left", "go left", "left turn", "left"],
    "WAITING_SIGNAL": ["wait for green signal", "wait for green", "green signal", "green light", "wait"],
    "WAITING_RIGHT": ["turn right", "go right", "right turn", "right"],
    "WAITING_PARK": ["park the car", "park car", "stop the car", "park here", "park"],
}


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "model": f"whisper-{os.getenv('WHISPER_MODEL', 'base')}"}


@app.post("/api/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    stage: str = Form(...),
    expected_phrase: str = Form(""),
):
    """Transcribe audio and match against expected phrase for a game stage.
    
    Args:
        file: Audio file (webm, wav, mp3).
        stage: Current game stage (e.g., WAITING_START).
        expected_phrase: The target phrase to match against.
    """
    file_path = None
    try:
        # Save uploaded audio to the 'audio' folder
        os.makedirs("audio", exist_ok=True)
        filename = file.filename or "audio_upload.webm"
        file_path = os.path.join("audio", filename)
        
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Transcribe with Whisper
        transcript = transcribe(file_path)
        
        # Get accepted variants for this stage
        variants = CHECKPOINT_VARIANTS.get(stage, [expected_phrase])
        
        # Match phrase
        result = match_phrase(transcript, variants)
        result["stage"] = stage
        
        print(f"Backend response: {result}")
        return result
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "matched": False,
            "transcript": "",
            "best_match": "",
            "confidence": 0,
            "stage": stage,
            "error": str(e),
        }
    finally:
        # We will leave the file in the audio directory for debugging purposes!
        pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
