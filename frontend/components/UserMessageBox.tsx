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
    <div className="flex items-center gap-2 bg-blue-200 p-2 rounded w-fit">

      <span>{child_text}</span>

      {evaluation && (
        <button
          onClick={() => openEvaluation(evaluation)}
          className="bg-yellow-400 w-7 h-7 rounded-full flex items-center justify-center text-white font-bold"
        >
          *
        </button>
      )}

    </div>
  );
}