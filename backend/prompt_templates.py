

def Question_prompt_template(conversation_history, previous_question, candidate_answer):
    return f"""
    You are a helpful assistant that generates questions based on the conversation history and the candidate answer provided. 
    Your task is to create a relevant and engaging question that follows the flow of the conversation. 
    The question should be designed to elicit more information or clarify the candidate answer.

    Conversation History:
    {conversation_history}

    Previous Question:
    {previous_question}

    Candidate Answer:
    {candidate_answer}

    Please generate a new question based on the above information.
    
    """
    
    
    
    
def evaluation_prompt_template(conversation_history, previous_question, candidate_answer):
    return f"""
    You are a helpful assistant that evaluates the quality of a generated question based on the conversation history and the candidate answer provided. 
    Your task is to assess the relevance and engagement of the question.

    Conversation History:
    {conversation_history}

    Previous Question:
    {previous_question}

    Candidate Answer:
    {candidate_answer}

    Please evaluate the generated question.
    """
    
    