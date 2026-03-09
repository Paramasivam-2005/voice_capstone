from audio_utils import generate_conversation_response, evaluate_child_response
from prompt_templates import build_conversation_prompt, build_evaluation_prompt
print(evaluate_child_response("I don't like school"))