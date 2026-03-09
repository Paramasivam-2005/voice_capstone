"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import QuestionCard from "@/components/QuestionCard";
import Recorder from "@/components/Recorder";

const questions = [
  {
    sentence: "She is playing",
    audio: "/audio/she_is_playing.mp3",
  },
  {
    sentence: "The cat is sleeping",
    audio: "/audio/the_cat_is_sleeping.mp3",
  },
  {
    sentence: "They are running",
    audio: "/audio/they_are_running.mp3",
  },
];

export default function Page() {
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<any>(null);

  const nextQuestion = () => {
    setResult(null); // reset previous score
    setIndex((prev) => (prev + 1) % questions.length);
  };

  const prevQuestion = () => {
    setResult(null); // reset previous score
    setIndex((prev) => (prev - 1 + questions.length) % questions.length);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-yellow-50">
      {/* Mobile container */}
      <div className="w-[380px] h-[720px] bg-white rounded-3xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b text-center">
          <h1 className="text-lg font-semibold">Pronunciation Practice</h1>
        </div>

        {/* Content */}
        <div className="mt-40 flex justify-center">
          <QuestionCard
            key={index}
            sentence={questions[index].sentence}
            audio={questions[index].audio}
            results={result?.results}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center items-center gap-6 mt-20">
          {/* Previous */}
          <button
            onClick={prevQuestion}
            className="bg-blue-500 text-white p-3 rounded-full shadow-md hover:scale-105 transition mt-5"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Recorder */}
          <Recorder
            sentence={questions[index].sentence}
            onResult={(data) => {
              const resultsMap: Record<string, number> = {};

              data.results.forEach((item: any) => {
                resultsMap[item.word] = item.score;
              });

              setResult({ results: resultsMap });
            }}
          />

          {/* Next */}
          <button
            onClick={nextQuestion}
            className="bg-blue-500 text-white p-3 rounded-full shadow-md hover:scale-105 transition mt-5"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}
