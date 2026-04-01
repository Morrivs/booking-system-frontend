import { MessageSquare, Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count: number;
}

export function StarRating({ rating, count }: StarRatingProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => {
          const full = rating >= s;
          const half = !full && rating >= s - 0.5;
          return full ? (
            <Star key={s} size={12} className="fill-indigo-400 text-indigo-400" />
          ) : half ? (
            <StarHalf key={s} size={12} className="fill-indigo-400 text-indigo-400" />
          ) : (
            <Star key={s} size={12} className="text-gray-700" />
          );
        })}
      </div>
      <span className="text-xs text-gray-500">
        {rating.toFixed(1)}
      </span>
      <span className="text-gray-700 text-xs">·</span>
      <div className="flex items-center gap-1 text-gray-500">
        <MessageSquare size={11} />
        <span className="text-xs">{count} {count === 1 ? "reseña" : "reseñas"}</span>
      </div>
    </div>
  );
}