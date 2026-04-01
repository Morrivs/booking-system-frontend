import { Star } from "lucide-react";
import { useState } from "react";

export const StarPicker = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="cursor-pointer transition-transform hover:scale-110"
        >
          <Star
            size={22}
            className={
              (hovered || value) >= s
                ? "fill-indigo-400 text-indigo-400"
                : "text-gray-700"
            }
          />
        </button>
      ))}
    </div>
  );
}