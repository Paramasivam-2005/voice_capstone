import React, { useEffect, useRef } from "react";

export default function AiMessageBox({
  message,
  audioURL,
  audioEnabled,
}: {
  message: string;
  audioURL?: string;
  audioEnabled: boolean;
}) {

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {

  if (!audioEnabled) return;

  if (audioRef.current && audioURL) {

    const playAudio = async () => {

      try {
        await audioRef.current?.play();
      } catch (err) {
        console.log("Autoplay blocked");
      }

    };

    playAudio();
  }

}, [audioURL, audioEnabled]);

  const handleEnded = () => {
    window.dispatchEvent(new Event("aiAudioFinished"));
  };

  return (
    <div className="max-w-[75%] bg-gray-100 text-gray-800 p-3 rounded-xl shadow-sm">

      <p>{message}</p>

      {audioURL && (
        <audio
          ref={audioRef}
          src={audioURL}
          onEnded={handleEnded}
          className="mt-2 w-full"
          controls
        />
      )}

    </div>
  );
}