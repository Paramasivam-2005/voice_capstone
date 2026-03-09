import { useChatStore } from "@/store/useChatStore";

export default function EvaluationPopup() {

  const { showEvaluation, selectedEvaluation, closeEvaluation } = useChatStore();

  if (!showEvaluation || !selectedEvaluation) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center">

      <div className="bg-white w-[380px] p-6 rounded-t-2xl relative">

        <button
          onClick={closeEvaluation}
          className="absolute top-4 right-4 text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Grammar Feedback
        </h2>

        <p className="text-red-500">
          {selectedEvaluation.errors[0]}
        </p>

        <p className="text-green-600 mt-3">
          {selectedEvaluation.corrected_sentence}
        </p>

        <p className="text-gray-500 mt-3">
          {selectedEvaluation.explanation}
        </p>

      </div>

    </div>
  );
}