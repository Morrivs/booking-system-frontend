import { Star, StarHalf } from "lucide-react";

export const StarDisplay = ({ rating, size = 14 }: { rating: number; size?: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => {
        const full = rating >= s;
        const half = !full && rating >= s - 0.5;
        return full ? (
          <Star key={s} size={size} className="fill-indigo-400 text-indigo-400" />
        ) : half ? (
          <StarHalf key={s} size={size} className="fill-indigo-400 text-indigo-400" />
        ) : (
          <Star key={s} size={size} className="text-gray-700" />
        );
      })}
    </div>
  );
}