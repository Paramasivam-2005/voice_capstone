import { useChatStore } from "../store/useChatStore";
export const sendAudio = async (audioBlob: Blob, sessionId: string) => {

    const { setSendAudioResponse } = useChatStore.getState();
    const formData = new FormData();

    formData.append('file', audioBlob, 'audio.webm');
    formData.append('session_id', sessionId); 

    const response = await fetch('http://localhost:8000/send-audio', {
        method: 'POST',
        body: formData,
    });
    
    const data = await response.json();
    
    setSendAudioResponse(data.child_text, data.ai_message, data.evaluation, data.audio_url);
    return data;
}