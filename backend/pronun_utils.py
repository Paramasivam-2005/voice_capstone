import os
import azure.cognitiveservices.speech as speechsdk
from dotenv import load_dotenv
import librosa
import soundfile as sf

load_dotenv()

AZURE_KEY = os.getenv("AZURE_API_KEY")
AZURE_REGION = "southeastasia"

speech_config = speechsdk.SpeechConfig(
    subscription=AZURE_KEY,
    region=AZURE_REGION
)

speech_config.speech_recognition_language = "en-US"


def convert_to_wav(input_file):
    y, sr = librosa.load(input_file, sr=16000, mono=True)

    output_file = input_file + "_fixed.wav"
    sf.write(output_file, y, 16000, subtype="PCM_16")

    return output_file


def pronunciation_evaluation(audio_file, reference):

    # Convert audio to Azure compatible format
    fixed_audio = convert_to_wav(audio_file)

    audio_config = speechsdk.audio.AudioConfig(filename=fixed_audio)

    pron_config = speechsdk.PronunciationAssessmentConfig(
        reference_text=reference,
        grading_system=speechsdk.PronunciationAssessmentGradingSystem.HundredMark,
        granularity=speechsdk.PronunciationAssessmentGranularity.Word
    )

    recognizer = speechsdk.SpeechRecognizer(
        speech_config=speech_config,
        audio_config=audio_config
    )

    pron_config.apply_to(recognizer)

    result = recognizer.recognize_once_async().get()
    pron_result = speechsdk.PronunciationAssessmentResult(result)

    words = []

    for word in pron_result.words:
        words.append({
        "word": word.word,
        "score": round(word.accuracy_score)
    })

    return words
    