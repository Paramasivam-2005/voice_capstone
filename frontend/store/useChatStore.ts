import { create } from "zustand";



  type Evaluation = {
    errors: string[];
    explanation: string;
    corrected_sentence: string;
  };

  type ChatMessage = {
  id: string;
  sender: "user" | "ai";
  text: string;
  audioURL?: string;
  evaluation?: Evaluation;
};



  type ChatState = {
    // start-session response
    showEvaluation: boolean;
    selectedEvaluation?: Evaluation;
    sessionId: string;
    messages: ChatMessage[];

    // setters
    openEvaluation: (evaluation: Evaluation) => void;
    closeEvaluation: () => void;
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

    addUserMessage: (text: string) => void;
    addAIMessage: (text: string, audioURL?: string, evaluation?: Evaluation) => void;
  };

  export const useChatStore = create<ChatState>((set) => ({
      
    sessionId: "",
    messages: [],
    showEvaluation: false,
    selectedEvaluation: undefined,

    openEvaluation: (evaluation) =>
  set({
    showEvaluation: true,
    selectedEvaluation: evaluation,
  }),
    closeEvaluation: () =>
  set({
    showEvaluation: false,
    selectedEvaluation: undefined,
  }),

   setStartSession: (
  sessionId: string,
  message: string,
  audio_url: string
) =>
  set((state) => ({
    sessionId,
    messages: [
      ...state.messages,
      {
        id: Date.now().toString(),
        sender: "ai",
        text: message,
        audioURL: audio_url,
      },
    ],
  })),

    setSendAudioResponse: (child_text: string, ai_message: string, evaluation: Evaluation, audio_url: string) =>
  set((state) => ({
    messages: [
      ...state.messages,

      {
        id: Date.now().toString(),
        sender: "user",
        text: child_text,
        evaluation: evaluation,
      },

      {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: ai_message,
        audioURL: audio_url,
      },
    ],
  })),
      addUserMessage: (text) =>
  set((state) => ({
    messages: [
      ...state.messages,
      { id: Date.now().toString(), sender: "user", text },
    ],
  })),

addAIMessage: (text, audioURL, evaluation) =>
  set((state) => ({
    messages: [
      ...state.messages,
      { id: Date.now().toString(), sender: "ai", text, audioURL, evaluation },
    ],
  })),
  }));