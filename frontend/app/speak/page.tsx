"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/useChatStore";
import { startSession } from "@/utils/StartSesstionAPI";

import VoiceDetector from "@/components/VoiceDetector";
import AiMessageBox from "@/components/AiMessageBox";
import UserMessageBox from "@/components/UserMessageBox";
import EvaluationPopup from "@/components/EvaluationPopup";

export default function SpeakPage() {
  const { messages } = useChatStore();
  const router = useRouter();
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);

  const handleStart = async () => {
    setAudioEnabled(true);
    setConversationStarted(true);

    await startSession(); // ⭐ AI starts conversation
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-[380px] h-[720px] bg-white rounded-3xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <span className="font-semibold text-gray-700">Speak with AI</span>

          <button
            onClick={() => router.push("/")}
            className="text-red-500 text-sm"
          >
            End
          </button>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            if (msg.sender === "ai") {
              return (
                <div key={msg.id} className="flex justify-start">
                  <AiMessageBox
                    message={msg.text}
                    audioURL={msg.audioURL}
                    audioEnabled={audioEnabled}
                  />
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex justify-end">
                <UserMessageBox
                  child_text={msg.text}
                  evaluation={msg.evaluation}
                />
              </div>
            );
          })}
        </div>

        {/* START BUTTON */}
        {!conversationStarted && (
          <div className="p-4 border-t">
            <button
              onClick={handleStart}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              Start Conversation
            </button>
          </div>
        )}

        {/* VOICE DETECTOR */}
        {conversationStarted && (
          <div className="border-t p-3">
            <VoiceDetector />
          </div>
        )}

        <EvaluationPopup />
      </div>
    </div>
  );
}
