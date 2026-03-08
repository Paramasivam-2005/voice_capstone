"use client";

import { MicVAD } from "@ricky0123/vad-web";
import { useEffect, useState, useRef } from "react";
import { encodeWAV } from "@/utils/wavEncoder";
import { useChatStore } from "@/store/useChatStore";
import { sendAudio } from "@/utils/SendAudioAPI";

export default function VoiceDetector() {

  const sessionId = useChatStore((state) => state.sessionId);
  
  const vadRef = useRef<any>(null);
  const [status, setStatus] = useState("Waiting AI...");
  const [isProcessing, setIsProcessing] = useState(false);

  // 🎤 Initialize VAD
  useEffect(() => {

    let vadInstance:any;

  async function initVAD() {
    const vad = await MicVAD.new({
      onSpeechStart: () => {
          
          if (isProcessing) return;

          console.log("🟢 Speech started");
          setStatus("🎤 Speaking...");
        },

        onSpeechEnd: async (audio: Float32Array) => {

          if (isProcessing) return;

          console.log("🔴 Speech ended");

          setIsProcessing(true);
          setStatus("🧠 AI thinking...");

          vad.pause(); // stop mic

          const wavBlob = encodeWAV(audio);

          if (sessionId) {

            try {

              await sendAudio(wavBlob, sessionId);

            } catch (err) {

              console.error("Send audio error:", err);

              setStatus("Error sending audio");
            }
          }

          setStatus("Waiting AI response...");
        },

        positiveSpeechThreshold: 0.92,
        negativeSpeechThreshold: 0.75,
        minSpeechMs: 800,
        redemptionMs: 600,
        preSpeechPadMs: 200,
        baseAssetPath:
          "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.29/dist/",

        onnxWASMBasePath:
          "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/",
      });

      vadRef.current = vad;
      vadInstance = vad;

      setStatus("Waiting AI...");
    }

    initVAD();

    return () => {
      vadInstance?.destroy();
    };

  }, [sessionId]);


  // ⭐ Resume mic when AI audio finishes
  useEffect(() => {

    const resumeListening = () => {

      if (!vadRef.current) return;

      console.log("🎧 AI finished → start listening");

      setIsProcessing(false);

      vadRef.current.start();

      setStatus("🎤 Listening...");
    };

    window.addEventListener("aiAudioFinished", resumeListening);

    return () => {
      window.removeEventListener("aiAudioFinished", resumeListening);
    };

  }, []);


  // 🧪 Debug button
  const manualResume = () => {

    if (!vadRef.current) return;

    setIsProcessing(false);

    vadRef.current.start();

    setStatus("🎤 Listening...");
  };


  return (

    <div className="flex flex-col items-center gap-2">

      <div className="text-sm text-gray-600">
        {status}
      </div>

      <button
        onClick={manualResume}
        className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
      >
        Resume Listening
      </button>

    </div>

  );
}