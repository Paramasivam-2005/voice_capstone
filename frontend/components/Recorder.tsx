"use client";

import { useState, useRef } from "react";
import Recorder from "recorder-js";
import { Mic, StopCircle } from "lucide-react";

type Props = {
  sentence: string;
  onResult: (data: any) => void;
};

export default function VoiceRecorder({ sentence, onResult }: Props) {

  const [recording, setRecording] = useState(false);
  const recorder = useRef<any>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioContext = new AudioContext({
      sampleRate: 16000,
    });

    recorder.current = new Recorder(audioContext);

    await recorder.current.init(stream);
    recorder.current.start();

    setRecording(true);
  };

  const stopRecording = async () => {
    const { blob } = await recorder.current.stop();
    setRecording(false);

    sendAudio(blob);
  };

  const sendAudio = async (blob: Blob) => {
    const formData = new FormData();

    formData.append("file", blob, "recording.wav");
    formData.append("reference", sentence);

    const res = await fetch("http://localhost:8000/upload_audio", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    onResult(data);
  };

  return (
    <div className="flex flex-col items-center mt-4">

      {!recording ? (
        <button
          onClick={startRecording}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:scale-105 transition"
        >
          <Mic size={28} />
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="bg-red-500 text-white p-4 rounded-full shadow-lg animate-pulse"
        >
          <StopCircle size={28} />
        </button>
      )}

    </div>
  );
}