import { Star, Flame, Utensils, Clock } from "lucide-react";
import Rating from "./Rating";

export default function MenuCard({ mealType, items = [], time, onRateClick }) {
  const getBadgeClass = (dietary) => {
    switch (dietary) {
      case "Veg":
        return "badge-veg";
      case "Non-Veg":
        return "badge-nonveg";
      case "Special":
        return "badge-special";
      case "Jain":
        return "badge-jain";
      default:
        return "badge-veg";
    }
  };

  return (
    <div className="card space-y-4 flex flex-col justify-between border hover:border-primary/30 transition-all duration-200 bg-white">
      <div>
        <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center font-bold">
              <Utensils size={16} />
            </div>
            <h3 className="text-lg font-bold capitalize text-ink-primary font-display">{mealType}</h3>
          </div>

          {time && (
            <span className="text-xs font-semibold text-ink-muted bg-surface-muted px-2.5 py-1 rounded-full border border-border/60 flex items-center gap-1">
              <Clock size={12} />
              {time}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-xs text-ink-muted italic py-4 text-center">No menu items published for this meal time.</p>
        ) : (
          <ul className="space-y-2.5">
            {items.map((item, idx) => {
              const ratingVal = item.avgRating || item.rating || 4.2;
              return (
                <li
                  key={item.id || item._id || idx}
                  className="flex items-center justify-between text-sm p-3 rounded-xl bg-surface-page/70 border border-border/50 hover:bg-white hover:border-border transition-all duration-150 group"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-ink-primary">{item.name}</span>
                    <span className={`badge ${getBadgeClass(item.dietary || item.type)}`}>
                      {item.dietary || item.type || "Veg"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.calories && (
                      <span className="text-xs font-medium text-ink-muted hidden sm:flex items-center gap-0.5">
                        <Flame size={12} className="text-amber-600" />
                        {item.calories} cal
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onRateClick?.(item.name, mealType)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                      title="Click to rate this dish"
                    >
                      <Star size={12} className="fill-amber-400 text-amber-500" />
                      <span>{Number(ratingVal).toFixed(1)}</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
