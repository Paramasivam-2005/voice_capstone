import { useChatStore } from "../store/useChatStore";

export const startSession = async () => {
    const response = await fetch('http://localhost:8000/start-session', {
        method: 'POST',
    });
    const data = await response.json();

    const { setStartSession } = useChatStore.getState();
    setStartSession(data.session_id, data.message, data.audio_url);

}