"use client";

import { MicVAD } from "@ricky0123/vad-web";
import { useEffect, useState } from "react";
import { encodeWAV } from "@/utils/wavEncoder";
import { useChatStore } from "@/store/useChatStore";
import { sendAudio } from "@/utils/SendAudioAPI";

export default function VoiceDetector() {
  const [status, setStatus] = useState("Initializing...");
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const sessionId = useChatStore((state) => state.sessionId);
  
  useEffect(() => {
    async function startVAD() {
      const vad = await MicVAD.new({
        onSpeechStart: () => {
          console.log("🟢 Speech started");
          setStatus("🎤 Speaking...");
        },

        onSpeechEnd: async (audio: Float32Array) => {
          console.log("🔴 Speech ended");

          setStatus("Processing...");

          // ✅ Convert raw audio to WAV
          const wavBlob = encodeWAV(audio);
          
          // ✅ Create preview URL
          const url = URL.createObjectURL(wavBlob);

          // ✅ Store audio locally
          setAudioURL(url);

          // OPTIONAL: Store Blob also in state if needed later
          console.log("Audio stored in frontend:", wavBlob);
  
          // ✅ Send audio to backend
          if (sessionId) {
            try {
              await sendAudio(wavBlob, sessionId);
            } catch (err) {
              console.error("Error sending audio:", err);
            }
          }

          setStatus("🎤 Listening...");
        },
        positiveSpeechThreshold: 0.8, 
        minSpeechMs: 800,
        redemptionMs: 200,
        baseAssetPath:
          "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.29/dist/",
        onnxWASMBasePath:
          "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/",
      });

      vad.start();
      setStatus("🎤 Listening...");
    }

    startVAD();
  }, [sessionId]); 

  return (
    <div style={{ padding: "20px" }}>
      <h2>{status}</h2>

      {audioURL && (
        <div>
          <h3>Last Recorded Audio:</h3>
          <audio controls src={audioURL}></audio>
        </div>
      )}
    </div>
  );
}
