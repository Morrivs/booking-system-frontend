import type { Review } from "../../models/review.model";
import { StarDisplay } from "../properties/StarDisplay";

export const ReviewCard = ({ review }: { review: Review & { user?: { name: string } } }) => {
  const initials = review.user?.name
    ? review.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-indigo-400">{initials}</span>
          </div>
          <span className="text-sm text-gray-300 font-medium">
            {review.user?.name ?? "Usuario"}
          </span>
        </div>
        <StarDisplay rating={review.rating} size={13} />
      </div>
      {review.comment && (
        <p className="text-sm text-gray-500 leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}