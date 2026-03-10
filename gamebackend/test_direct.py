import os
from dotenv import load_dotenv
from gtts import gTTS
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)

phrase = "start the car"
print(f"Generating '{phrase}'...")
tts = gTTS(text=phrase, lang='en')
tts.save("test_direct.mp3")

print("Calling OpenAI API...")
with open("test_direct.mp3", "rb") as f:
    try:
        result = client.audio.transcriptions.create(
            model=os.getenv("WHISPER_MODEL", "whisper-1"),
            file=f,
        )
        print(f"SUCCESS! Transcript: '{result.text}'")
    except Exception as e:
        print(f"FAILED! Error: {e}")
        import traceback
        traceback.print_exc()
