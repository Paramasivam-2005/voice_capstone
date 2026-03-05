from openai import OpenAI
import uuid
import os
import json
from prompt_templates import build_conversation_prompt, build_evaluation_prompt

client = OpenAI(api_key="sk-YMU3vf-ofzirb1BnrBqyig", base_url="https://apidev.navigatelabsai.com/")

AUDIO_DIR = "audio"
os.makedirs(AUDIO_DIR, exist_ok=True)


def text_to_speech(text: str):
    filename = f"{uuid.uuid4()}.mp3"
    path = os.path.join(AUDIO_DIR, filename)

    speech = client.audio.speech.create(
        model="gpt-4o-mini-tts",
        voice="alloy",
        input=text
    )

    with open(path, "wb") as f:
        f.write(speech.content)

    return path


def speech_to_text(file_path: str):
    with open(file_path, "rb") as audio:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio
        )
    return transcript.text


def generate_conversation_response(session_id, child_text, sessions):

    history = sessions[session_id]["history"]

    prompt = build_conversation_prompt(
        history=history,
        child_response=child_text
    )

    response = client.chat.completions.create(
        model="gpt-4.1-nano",
        messages=[
            {"role": "system", "content": prompt}
        ],
        temperature=0.7,
        response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "conversation_schema",
            "schema": {
                "type": "object",
                "properties": {
                    "response": {"type": "string"}
                },
                "required": ["response"]
            }
        }
    }
    )

    raw = response.choices[0].message.content

    try:
        parsed = json.loads(raw)
        ai_message = parsed["response"]
    except:
        ai_message = raw

    # Save to history
    if child_text:
        history.append({"role": "child", "content": child_text})

    history.append({"role": "ai", "content": ai_message})

    return ai_message


def evaluate_child_response(child_text):

    prompt = build_evaluation_prompt(child_text)

    response = client.chat.completions.create(
        model="gpt-4.1-nano",
        messages=[
            {"role": "system", "content": prompt}
        ],
        temperature=0.3,
        response_format = {
    "type": "json_schema",
    "json_schema": {
        "name": "evaluation_schema",
        "schema": {
            "type": "object",
            "properties": {
                "errors": {
                    "type": "array",
                    "items": {"type": "string"}
                },
                "explanation": {
                    "type": "string"
                },
                "corrected_sentence": {
                    "type": "string"
                }
            },
            "required": ["errors", "explanation", "corrected_sentence"],
            "additionalProperties": False
        }
    }
}
    )
    

    raw = response.choices[0].message.content

    
    parsed = json.loads(raw)
    return parsed
    