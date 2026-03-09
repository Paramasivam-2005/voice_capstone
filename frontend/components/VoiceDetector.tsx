"use client";

import { MicVAD } from "@ricky0123/vad-web";co
import { useEffect, useState, useRef, useCallback } from "react";
import { encodeWAV } from "@/utils/wavEncoder";
import { useChatStore } from "@/store/useChatStore";
import { sendAudio } from "@/utils/SendAudioAPI";

export default function VoiceDetector() {
  const sessionId = useChatStore((state) => state.sessionId);
  const vadRef = useRef<any>(null);
  const isProcessingRef = useRef(false); // ✅ use ref, not state, for closure-safe access
  const [status, setStatus] = useState("Waiting AI...");

  useEffect(() => {
    let vadInstance: any;

    async function initVAD() {
      const vad = await MicVAD.new({
        // ✅ OPTIMAL THRESHOLDS (Silero default gap rule: positive - 0.15 = negative)
        positiveSpeechThreshold: 0.5,   // was 0.92 — way too strict
        negativeSpeechThreshold: 0.35,  // was 0.75 — keep gap ~0.15

        // ✅ TIMING
        minSpeechMs: 250,       // was 800 — lets normal speech through
        redemptionMs: 400,      // was 600 — reasonable pause tolerance
        preSpeechPadMs: 300,    // was 200 — capture word beginnings better

        // ✅ CDN PATHS (correct)
        baseAssetPath: "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.29/dist/",
        onnxWASMBasePath: "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/",

        onSpeechStart: () => {
          if (isProcessingRef.current) return; // ✅ ref is always fresh
          console.log("🟢 Speech started");
          setStatus("🎤 Speaking...");
        },

        // ✅ fires when segment is too short — helps with debugging misfires
        onVADMisfire: () => {
          console.log("⚠️ VAD misfire (too short, ignored)");
          setStatus("🎤 Listening...");
        },

        onSpeechEnd: async (audio: Float32Array) => {
          if (isProcessingRef.current) return; // ✅ ref is always fresh

          console.log("🔴 Speech ended, samples:", audio.length);
          isProcessingRef.current = true;
          setStatus("🧠 AI thinking...");

          vad.pause();

          const wavBlob = encodeWAV(audio);

          if (sessionId) {
            try {
              await sendAudio(wavBlob, sessionId);
            } catch (err) {
              console.error("Send audio error:", err);
              setStatus("❌ Error sending audio");
              isProcessingRef.current = false;
              vad.start(); // recover on error
            }
          }

          setStatus("⏳ Waiting AI response...");
        },
      });

      vadRef.current = vad;
      vadInstance = vad;
      vad.start(); // ✅ auto-start on init
      setStatus("🎤 Listening...");
    }

    initVAD();
    return () => { vadInstance?.destroy(); };
  }, [sessionId]);

  // Resume after AI finishes speaking
  useEffect(() => {
    const resumeListening = () => {
      if (!vadRef.current) return;
      console.log("🎧 AI finished → resuming mic");
      isProcessingRef.current = false;
      vadRef.current.start();
      setStatus("🎤 Listening...");
    };

    window.addEventListener("aiAudioFinished", resumeListening);
    return () => window.removeEventListener("aiAudioFinished", resumeListening);
  }, []);

  const manualResume = () => {
    if (!vadRef.current) return;
    isProcessingRef.current = false;
    vadRef.current.start();
    setStatus("🎤 Listening...");
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-sm text-gray-600">{status}</div>
      <button
        onClick={manualResume}
        className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
      >
        Resume Listening
      </button>
    </div>
  );
}