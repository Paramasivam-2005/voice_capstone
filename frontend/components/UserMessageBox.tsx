import { useChatStore } from "@/store/useChatStore";

export default function UserMessageBox({
  child_text,
  evaluation,
}: {
  child_text: string;
  evaluation?: any;
}) {

  const { openEvaluation } = useChatStore();

  return (
    <div className="max-w-[75%] bg-blue-600 text-white p-3 rounded-xl shadow-sm flex items-center gap-2">

      <span>{child_text}</span>

      {evaluation && (
        <button
          onClick={() => openEvaluation(evaluation)}
          className="bg-yellow-400 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
        >
          !
        </button>
      )}

    </div>
  );
}