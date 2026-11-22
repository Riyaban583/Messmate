import { useState } from "react";
import { Star } from "lucide-react";

const ratingLabels = {
  1: "Poor 😞",
  2: "Fair 😐",
  3: "Good 🙂",
  4: "Very Good 😊",
  5: "Excellent 🤩",
};

export default function Rating({ value = 0, onChange, readOnly = false, size = 22, showLabel = true }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  // Semantic color according to design.md §1
  const getStarColor = (val) => {
    if (val >= 4) return "text-emerald-500 fill-emerald-400";
    if (val >= 2.5) return "text-amber-400 fill-amber-400";
    return "text-rose-500 fill-rose-400";
  };

  const getLabelBadge = (val) => {
    if (val >= 4) return "bg-emerald-50 text-emerald-800 border-emerald-200";
    if (val >= 2.5) return "bg-amber-50 text-amber-800 border-amber-200";
    if (val > 0) return "bg-rose-50 text-rose-800 border-rose-200";
    return "bg-surface-muted text-ink-muted border-border/60";
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1" role={readOnly ? undefined : "radiogroup"} aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => {
          const isFilled = n <= display;
          return (
            <button
              key={n}
              type="button"
              disabled={readOnly}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onMouseEnter={() => !readOnly && setHovered(n)}
              onMouseLeave={() => !readOnly && setHovered(0)}
              onClick={() => !readOnly && onChange?.(n)}
              className={`transition-all duration-150 ${
                readOnly ? "cursor-default" : "cursor-pointer hover:scale-125 active:scale-95"
              }`}
            >
              <Star
                size={size}
                className={`transition-colors duration-150 ${
                  isFilled ? getStarColor(display) : "text-border fill-surface-muted/60"
                }`}
              />
            </button>
          );
        })}
      </div>

      {showLabel && (
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shadow-2xs transition-colors ${getLabelBadge(display)}`}>
          {display > 0 ? ratingLabels[display] || `${display}/5` : "Tap to Rate"}
        </span>
      )}
    </div>
  );
}
