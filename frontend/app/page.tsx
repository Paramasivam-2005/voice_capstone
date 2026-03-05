"use client";
import { useEffect } from "react";
import { useState } from "react";

import { useChatStore } from "@/store/useChatStore";
import {startSession} from "@/utils/StartSesstionAPI";

import VoiceDetector from "@/components/VoiceDetector";
import AiMessageBox from "@/components/AiMessageBox";
import UserMessageBox from "@/components/UserMessageBox";
import EvaluationPopup from "@/components/EvaluationPopup";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  useEffect((() => {
      startSession();
  }),[]);

  const [audioEnabled, setAudioEnabled] = useState(false);

   const { messages} = useChatStore();

 

  return (
    <div className="flex flex-col h-screen justify-between">

      {/* Chat Area */}
      <div className="flex flex-col gap-4 p-4 overflow-y-auto">

        {messages.map((msg) => {

          if (msg.sender === "ai") {
            return (
              <AiMessageBox
                key={msg.id}
                message={msg.text}
                audioURL={msg.audioURL}
                evaluation={msg.evaluation}
                audioEnabled={audioEnabled}
              />
            );
          }

          return (
            <UserMessageBox
              key={msg.id}
              child_text={msg.text}
              evaluation={msg.evaluation}
            />
          );
        })}

      </div>

      {/* Voice Detector */}
      <VoiceDetector />

      {!audioEnabled && (
        <button
          onClick={() => setAudioEnabled(true)}
          className="bg-green-500 text-white p-3"
        >
          Enable Audio
        </button>
        
      )}
      <EvaluationPopup />
    </div>
      
      
  );
}
  