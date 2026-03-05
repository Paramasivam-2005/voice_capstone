import React, { useEffect, useRef } from "react";

export default function AiMessageBox({
  message,
  audioURL,
  audioEnabled,
}: {
  message: string;
  audioURL: string;
  audioEnabled: boolean;
}) {

  const audioRef = useRef<HTMLAudioElement>(null);


  useEffect(() => {
    if (audioRef.current && audioURL && audioEnabled) {
      audioRef.current.play().catch((err) => {
        console.log("Autoplay blocked:", err);
      });
    }
  }, [audioURL, audioEnabled]);
  
  return (
    <>
      <div className="h-10 text-[#000000] bg-amber-200 w-[200px]">
        {message}
      </div>
      {audioURL && (
        <div>
          <audio ref={audioRef} controls src={audioURL}></audio>
        </div>
      )}
    </>
  );
}
