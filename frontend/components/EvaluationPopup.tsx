import { useChatStore } from "@/store/useChatStore";

export default function EvaluationPopup() {

  const { showEvaluation, selectedEvaluation, closeEvaluation } = useChatStore();

  if (!showEvaluation || !selectedEvaluation) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end">

      <div className="bg-white w-full p-6 rounded-t-2xl">

        <button
          onClick={closeEvaluation}
          className="mb-4"
        >
          ❌
        </button>

        <h2 className="text-xl font-bold mb-4">
          Grammar Corrections
        </h2>

        <p className="text-red-500">
          {selectedEvaluation.errors[0]}
        </p>

        <p className="text-green-600 mt-3">
          {selectedEvaluation.corrected_sentence}
        </p>

        <p className="text-gray-600 mt-3">
          {selectedEvaluation.explanation}
        </p>

      </div>

    </div>
  );
}