from openai import OpenAI
import uuid
import os
import json
from prompt_templates import Question_prompt_template, evaluation_prompt_template

#initialize the client
client = OpenAI(api_key = "sk-YMU3vf-ofzirb1BnrBqyig",base_url="https://apidev.navigatelabsai.com/")


#state management variables
conversation_history = []
previous_question = None
answer_for_previous_answer = None

# Ensure the audio directory exists
AUDIO_DIR = "audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

# Audio utilities text to speech and speech to text functions 
# return the path to the audio file for text
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


# Audio utilities text to speech and speech to text functions 
# return the transcribed text for the audio file
def speech_to_text(file_path: str):
    with open(file_path, "rb") as audio:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio
        )
    return transcript.text


# Function to generate a question based on the conversation history,
# previous question, and candidate answer
def generate_question():
        prompt = Question_prompt_template(conversation_history, previous_question=previous_question, candidate_answer=answer_for_previous_answer)


        response = client.chat.completions.create(
        model="gemini-2.5-flash",
        messages=[
            {"role": "system", "content": prompt}
        ],
        temperature=0.7,)

        raw= response.choices[0].message.content
        try:
            parsed = json.loads(raw)
            question = parsed["query"]
        except (json.JSONDecodeError, KeyError):
            question = raw  # fallback if JSON parsing fails

        previous_question = question
        return question
    
def evaluate_question():
        prompt = evaluation_prompt_template(conversation_history, previous_question=previous_question, candidate_answer=answer_for_previous_answer)

        response = client.chat.completions.create(
        model="gpt-4.1-nano",
        messages=[
            {"role": "system", "content": prompt}
        ],
        temperature=0.7,)

        raw= response.choices[0].message.content
        try:
            parsed = json.loads(raw)
            evaluation = parsed["evaluation"]
        except (json.JSONDecodeError, KeyError):
            evaluation = raw  # fallback if JSON parsing fails

        return evaluation   



