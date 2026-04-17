import { Loader2, Trash2 } from "lucide-react";
import type { HostProperty } from "../../pages/Property/PropertyListHost";

export function DeletePropertyModal({
  property,
  onConfirm,
  onCancel,
  isLoading,
}: {
  property: HostProperty;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
            <Trash2 size={16} className="text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Eliminar propiedad</p>
            <p className="text-xs text-gray-500 mt-0.5">Esta acción no se puede deshacer.</p>
          </div>
        </div>

        <p className="text-sm text-gray-400">
          ¿Estás seguro que deseas eliminar{" "}
          <span className="text-white font-medium">"{property.title}"</span>?
        </p>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold shadow-lg shadow-red-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {isLoading ? "Eliminando..." : "Sí, eliminar"}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 text-sm font-medium hover:border-gray-600 hover:text-gray-200 disabled:opacity-60 transition-all duration-200 cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}