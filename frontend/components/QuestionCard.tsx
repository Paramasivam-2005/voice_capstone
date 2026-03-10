'use client';

import { useRef, useEffect } from "react";
import { Volume2 } from "lucide-react";

type Props = {
  sentence: string;
  audio: string;
  results?: Record<string, number>;
};

export default function QuestionCard({ sentence, audio, results }: Props) {

  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    audioRef.current?.play();
  };

  // ✅ autoplay when question loads
  useEffect(() => {
    audioRef.current?.play();
  }, [audio]);

  const words = sentence.split(" ");

  return (
    <div className="w-[300px] h-[300px] bg-gray-100 rounded-xl flex flex-col items-center justify-center p-6">

      <p className="text-gray-500">Read this sentence</p>

      {/* WORD DISPLAY */}
      <div className="flex gap-2 mt-2 flex-wrap justify-center">
        {words.map((word, i) => {
          const score = results?.[word];

          const color =
            score !== undefined && score >= 70
              ? "text-green-600"
              : "text-black";

          return (
            <span key={i} className={`text-xl font-bold ${color}`}>
              {word}
            </span>
          );
        })}
      </div>

      {/* SPEAKER BUTTON */}
      <button
        onClick={playAudio}
        className="flex justify-center items-center mt-4 bg-blue-100 p-4 rounded-full"
      >
        <Volume2 size={17} className="text-black" />
      </button>

      {/* AUDIO */}
      <audio ref={audioRef}>
        <source src={audio} type="audio/mpeg" />
      </audio>

    </div>
  );
}