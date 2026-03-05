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

   const handleEnded = () => {
    window.dispatchEvent(new Event("aiAudioFinished"));
  };
  
  return (
     <>
      <div className="h-10 text-black bg-amber-200 w-[200px]">
        {message}
      </div>

      {audioURL && (
        <audio
          ref={audioRef}
          src={audioURL}
          controls
          onEnded={handleEnded}
        />
      )}
    </>
  );
}
