import { Loader2 } from "lucide-react";

export function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  isLoading,
  confirmLabel = "Confirmar",
  confirmClass = "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25 hover:shadow-indigo-500/40",
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  confirmLabel?: string;
  confirmClass?: string;
}) {
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-3">
      <p className="text-sm text-gray-300">{message}</p>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white text-sm font-semibold shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer ${confirmClass}`}
        >
          {isLoading ? <Loader2 size={13} className="animate-spin" /> : null}
          {confirmLabel}
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm font-medium hover:border-gray-600 hover:text-gray-200 disabled:opacity-60 transition-all duration-200 cursor-pointer"
        >
          Volver
        </button>
      </div>
    </div>
  );
}