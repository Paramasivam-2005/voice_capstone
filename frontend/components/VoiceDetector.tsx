"use client";

import { MicVAD } from "@ricky0123/vad-web";
import { useEffect, useState, useRef } from "react";
import { encodeWAV } from "@/utils/wavEncoder";
import { useChatStore } from "@/store/useChatStore";
import { sendAudio } from "@/utils/SendAudioAPI";

export default function VoiceDetector() {

  const [status, setStatus] = useState("Initializing...");
  const vadRef = useRef<any>(null);

  const sessionId = useChatStore((state) => state.sessionId);
  const [isProcessing, setIsProcessing] = useState(false);

  // 🎤 START VAD
  useEffect(() => {

    async function startVAD() {

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
          setStatus("Processing...");

          vad.pause(); // 🛑 stop mic

          const wavBlob = encodeWAV(audio);

          if (sessionId) {
            try {
              await sendAudio(wavBlob, sessionId);
            } catch (err) {
              console.error(err);
            }
          }

          setStatus("Waiting AI response...");
        },

        positiveSpeechThreshold: 0.8,
        minSpeechMs: 400,
        redemptionMs: 300,

        baseAssetPath:
          "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.29/dist/",

        onnxWASMBasePath:
          "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/",
      });

      vadRef.current = vad; // ⭐ IMPORTANT

      vad.start();
      setStatus("🎤 Listening...");
    }

    startVAD();

  }, [sessionId]);



  // ⭐ LISTEN WHEN AI AUDIO FINISHES
  useEffect(() => {

    const resume = () => {

      if (vadRef.current) {

        vadRef.current.start();

        setIsProcessing(false);
        setStatus("🎤 Listening...");
      }
    };

    window.addEventListener("aiAudioFinished", resume);

    return () => {
      window.removeEventListener("aiAudioFinished", resume);
    };

  }, []);




  const resumeListening = () => {

    if (vadRef.current) {

      vadRef.current.start();

      setIsProcessing(false);

      setStatus("🎤 Listening...");
    }
  };



  return (
    <div style={{ padding: "20px" }}>
      <h2>{status}</h2>

      {/* debug button */}
      <button
        onClick={resumeListening}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Resume Listening
      </button>
    </div>
  );
}