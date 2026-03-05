"use client";
import { useEffect } from "react";
import { useState } from "react";

import { useChatStore } from "@/store/useChatStore";
import {startSession} from "@/utils/StartSesstionAPI";

import VoiceDetector from "@/components/VoiceDetector";
import AiMessageBox from "@/components/AiMessageBox";
import UserMessageBox from "@/components/UserMessageBox";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  useEffect((() => {
      startSession();
  }),[]);

  const [audioEnabled, setAudioEnabled] = useState(false);

   const { message, ai_message, audio_url, child_text} = useChatStore();

 console.log("Message from store:", message);
 console.log("Audio URL from store:", audio_url);

  return (
    <div>
      
      <VoiceDetector />
      {!audioEnabled && (
        <button
          onClick={() => setAudioEnabled(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Enable Audio
        </button>
      )}
      
      {message && <><AiMessageBox message={message} audioURL={audio_url} audioEnabled={audioEnabled}/></>}
      
      {child_text && <UserMessageBox child_text={child_text} /> }
    </div>
  );
}
  