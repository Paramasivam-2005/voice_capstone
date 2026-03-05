  import { create } from "zustand";



  type Evaluation = {
    errors: string[];
    explanation: string;
    corrected_sentence: string;
  };

  type ChatState = {
    // start-session response
    sessionId: string;
    message: string;
    audio_url: string;

    // send-audio response
    child_text: string;
    ai_message: string;
    evaluation: Evaluation | null;

    // setters
    setStartSession: (
      sessionId: string,
      message: string,
      audio_url: string
    ) => void;

    setSendAudioResponse: (
      child_text: string,
      ai_message: string,
      evaluation: Evaluation,
      audio_url: string
    ) => void;
  };

  export const useChatStore = create<ChatState>((set) => ({
      
    sessionId: "",
    message: "",
    audio_url: "",

    child_text: "",
    ai_message: "",
    evaluation: null,

    setStartSession: (sessionId, message, audio_url) =>
      set({
        sessionId,
        message,
        audio_url,
      }),

    setSendAudioResponse: (child_text, ai_message, evaluation, audio_url) =>
      set({
        child_text,
        ai_message,
        evaluation,
        audio_url,
      }),
  }));