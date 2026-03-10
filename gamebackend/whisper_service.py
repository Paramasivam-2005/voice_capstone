"""Whisper-based speech-to-text transcription service using faster-whisper."""
import os
from dotenv import load_dotenv
from faster_whisper import WhisperModel

load_dotenv()

# We configure faster_whisper to use CPU and compute_type="int8" for local performance
model_size = os.getenv("WHISPER_MODEL", "tiny.en")

print(f"Loading faster-whisper model '{model_size}'...")
model = WhisperModel(model_size, device="cpu", compute_type="int8")
print(f"Model '{model_size}' loaded successfully!")

def transcribe(audio_path: str) -> str:
    """Transcribe an audio file to text using faster-whisper locally.
    
    Args:
        audio_path: Path to the audio file.
    
    Returns:
        Transcribed text string.
    """
    try:
        # faster-whisper uses PyAV to decode audio directly without system ffmpeg
        segments, info = model.transcribe(audio_path, beam_size=5)
        
        transcript = " ".join([segment.text for segment in segments])
        transcript = transcript.strip().lower()
        
        print(f"Faster-Whisper transcript: {transcript}")
        return transcript
    except Exception as e:
        print(f"Transcription error: {e}")
        import traceback
        traceback.print_exc()
        return ""