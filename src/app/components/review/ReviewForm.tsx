import { useMutation } from "@tanstack/react-query";
import { AlertCircle, BadgeCheck, CheckCircle, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { reviewService } from "../../services/review.service";
import { StarPicker } from "../properties/StarPicker";

export const ReviewForm = ({
  propertyId,
  userId,
  bookingId,
  onSubmitted,
}: {
  propertyId: string;
  userId: string;
  bookingId: string;
  onSubmitted: () => void;
}) => {
  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError]     = useState<string | null>(null);

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: () =>
      reviewService.create({ 
        bookingId,    // Según tu DTO de NestJS
        rating, 
        comment 
      }),
    onSuccess: onSubmitted,
    onError: (e: any) => {
      setError(e?.response?.data?.message ?? "Error al enviar la reseña.");
    },
  });

  const handleSubmit = () => {
    setError(null);
    if (rating === 0) return setError("Selecciona una calificación.");
    mutate();
  };

  if (isSuccess) {
    return (
      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl px-4 py-3">
        <CheckCircle size={14} className="shrink-0" />
        ¡Gracias por tu reseña!
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-indigo-500/20 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <BadgeCheck size={16} className="text-indigo-400" />
        <p className="text-sm font-medium text-white">Deja tu reseña</p>
        <span className="text-xs text-gray-500">· Estadía completada</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3">
          <AlertCircle size={13} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
          Calificación
        </label>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
          Comentario
        </label>
        <textarea
          rows={3}
          placeholder="¿Cómo fue tu estadía?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-gray-800/60 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 px-4 py-3 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 focus:bg-indigo-500/5 resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
      >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        {isPending ? "Enviando..." : "Publicar reseña"}
      </button>
    </div>
  );
}