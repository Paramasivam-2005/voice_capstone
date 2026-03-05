import { create } from "zustand";
import { v4 as uuidv4 } from "uuid"; // unique IDs for messages

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
  sessionId: string;
  messages: ChatMessage[];
  setStartSession: (sessionId: string) => void;
  addUserMessage: (text: string) => void;
  addAIMessage: (text: string, audioURL?: string, evaluation?: Evaluation) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  sessionId: "",
  messages: [],

  setStartSession: (sessionId) => set({ sessionId }),

  addUserMessage: (text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: uuidv4(), sender: "user", text },
      ],
    })),

  addAIMessage: (text, audioURL, evaluation) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: uuidv4(), sender: "ai", text, audioURL, evaluation },
      ],
    })),
}));