"use client";

import Link from "next/link";


export default function HomePage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      {/* Phone container */}
      <div className="w-[380px] h-[720px] bg-white rounded-3xl shadow-xl p-6 flex flex-col">

        {/* Header */}
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          English Learning
        </h1>

        <p className="text-gray-500 mb-6">
          Practice speaking and improve your grammar.
        </p>

        {/* Learning Cards */}
        <div className="flex flex-col gap-4">

          {/* Speak With AI */}
          <Link href="/speak">
            <div className="bg-blue-600 text-white p-5 rounded-xl shadow hover:scale-[1.02] transition">
              <h2 className="text-lg font-semibold">
                Speak with AI
              </h2>
              <p className="text-sm opacity-80 mt-1">
                Practice English conversation with AI
              </p>
            </div>
          </Link>

          {/* Friend Feature */}
          <Link href="/pronunciation">
            <div className="bg-purple-600 text-white p-5 rounded-xl shadow hover:scale-[1.02] transition">
              <h2 className="text-lg font-semibold">
                Practice Exercises
              </h2>
              <p className="text-sm opacity-80 mt-1">
                Improve grammar and vocabulary
              </p>
            </div>
          </Link>

        </div>

      </div>
    </div>
  );
}