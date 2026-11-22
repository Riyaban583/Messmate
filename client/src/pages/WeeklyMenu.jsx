import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Search, 
  Sparkles, 
  Flame, 
  Star, 
  Printer, 
  Check, 
  Clock, 
  Filter, 
  Grid, 
  ListFilter,
  Utensils,
  Sun,
  Coffee,
  Moon,
  Sunrise,
  ArrowRight
} from "lucide-react";
import { getStoredWeeklyMenu } from "../services/mockData";

const daysList = [
  { dayId: "mon", label: "Mon", full: "Monday" },
  { dayId: "tue", label: "Tue", full: "Tuesday" },
  { dayId: "wed", label: "Wed", full: "Wednesday" },
  { dayId: "thu", label: "Thu", full: "Thursday" },
  { dayId: "fri", label: "Fri", full: "Friday" },
  { dayId: "sat", label: "Sat", full: "Saturday" },
  { dayId: "sun", label: "Sun", full: "Sunday" },
];

const mealIcons = {
  breakfast: Sunrise,
  lunch: Sun,
  snacks: Coffee,
  dinner: Moon,
};

export default function WeeklyMenu() {
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [selectedDayId, setSelectedDayId] = useState("mon");
  const [viewMode, setViewMode] = useState("day"); // 'day' or 'grid'
  const [dietaryFilter, setDietaryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = getStoredWeeklyMenu();
    setWeeklyMenu(data);

    // Auto select today's day of week
    const dayIndex = new Date().getDay(); // 0 is Sunday
    const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const todayId = dayMap[dayIndex] || "mon";
    setSelectedDayId(todayId);
  }, []);

  const activeDayData = weeklyMenu.find((d) => d.dayId === selectedDayId) || weeklyMenu[0];

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to filter items based on dietary tag and search
  const filterItems = (items) => {
    if (!items) return [];
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDiet = dietaryFilter === "all" ? true : item.type === dietaryFilter;
      return matchesSearch && matchesDiet;
    });
  };

  const renderDietBadge = (type) => {
    switch (type) {
      case "veg":
        return (
          <span className="badge badge-veg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Pure Veg
          </span>
        );
      case "non-veg":
        return (
          <span className="badge badge-nonveg">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            Non-Veg / Egg
          </span>
        );
      case "special":
        return (
          <span className="badge badge-special">
            <Sparkles size={12} className="text-amber-600" />
            Chef Special
          </span>
        );
      case "jain":
        return (
          <span className="badge badge-jain">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            Jain Option
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="card-glow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary border border-primary-100 text-xs font-bold mb-2">
            <Calendar size={14} />
            <span>Full 7-Day Campus Schedule</span>
          </div>
          <h1 className="text-h1 text-ink-primary font-display font-extrabold">Weekly Mess Menu</h1>
          <p className="text-body-sm text-ink-secondary mt-1">
            Browse complete meals, dietary options, calories, and community ratings from Monday to Sunday.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="btn-outline">
            <Printer size={16} />
            <span className="hidden sm:inline">Print Schedule</span>
          </button>
          <button onClick={handleShare} className="btn-secondary">
            {copied ? <Check size={16} className="text-secondary" /> : <Sparkles size={16} />}
            <span>{copied ? "Link Copied!" : "Share Menu"}</span>
          </button>
        </div>
      </div>

      {/* Filter and View Control Bar */}
      <div className="card space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Day Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {daysList.map((d) => {
              const isActive = selectedDayId === d.dayId;
              return (
                <button
                  key={d.dayId}
                  onClick={() => {
                    setSelectedDayId(d.dayId);
                    if (viewMode === "grid") setViewMode("day");
                  }}
                  className={`flex flex-col items-center min-w-[58px] px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    isActive && viewMode === "day"
                      ? "bg-primary text-white shadow-md shadow-primary-500/20 font-bold scale-[1.03]"
                      : "bg-surface-muted text-ink-secondary hover:bg-surface-page font-medium"
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-wider opacity-80">{d.label}</span>
                  <span className="text-body-sm font-extrabold">{d.full.slice(0, 3)}</span>
                </button>
              );
            })}
          </div>

          {/* View Toggles (Day vs Full 7-Day Grid) */}
          <div className="flex items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 border-border">
            <div className="flex items-center bg-surface-muted p-1 rounded-xl border border-border/60">
              <button
                onClick={() => setViewMode("day")}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === "day" ? "bg-white text-primary shadow-xs" : "text-ink-secondary hover:text-ink-primary"
                }`}
              >
                <ListFilter size={14} />
                <span>Day View</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === "grid" ? "bg-white text-primary shadow-xs" : "text-ink-secondary hover:text-ink-primary"
                }`}
              >
                <Grid size={14} />
                <span>7-Day Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Dietary Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 border-t border-border/60 pt-3">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g., Paneer, Biryani, Dosa, Dal)..."
              className="w-full bg-surface-muted/50 border border-border/80 rounded-xl pl-9 pr-4 py-2 text-body-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-ink-muted flex items-center gap-1 mr-1">
              <Filter size={12} /> Filter:
            </span>
            {[
              { id: "all", label: "All Items" },
              { id: "veg", label: "🟢 Veg" },
              { id: "non-veg", label: "🔴 Non-Veg" },
              { id: "special", label: "✨ Special" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDietaryFilter(f.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                  dietaryFilter === f.id
                    ? "bg-primary-50 text-primary border-primary-200 font-bold"
                    : "bg-white text-ink-secondary border-border/80 hover:bg-surface-muted"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SINGLE DAY DETAILED VIEW */}
      {viewMode === "day" && activeDayData && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-h2 text-ink-primary font-display flex items-center gap-2">
              <span>{activeDayData.day}'s Menu</span>
              <span className="text-xs font-normal text-ink-muted bg-surface-muted px-2.5 py-1 rounded-full border border-border">
                {activeDayData.meals.reduce((acc, m) => acc + m.items.length, 0)} Dishes Served
              </span>
            </h2>

            <Link
              to="/feedback"
              className="text-body-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
            >
              <span>Give Dish Feedback</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {activeDayData.meals.map((meal) => {
              const IconComp = mealIcons[meal.mealType] || Utensils;
              const itemsList = filterItems(meal.items);

              return (
                <div key={meal.mealType} className="card relative overflow-hidden flex flex-col justify-between">
                  {/* Accent Top Border */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary" />

                  <div>
                    {/* Meal Header */}
                    <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary flex items-center justify-center">
                          <IconComp size={18} />
                        </div>
                        <div>
                          <h3 className="text-h3 capitalize font-bold text-ink-primary">{meal.mealType}</h3>
                          <p className="text-[11px] text-ink-muted flex items-center gap-1 mt-0.5">
                            <Clock size={12} />
                            {meal.time}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-ink-muted bg-surface-page px-2 py-1 rounded-md">
                        {itemsList.length} items
                      </span>
                    </div>

                    {/* Dish Items List */}
                    {itemsList.length === 0 ? (
                      <p className="text-body-sm text-ink-muted italic py-4 text-center">
                        No dishes match your active filter.
                      </p>
                    ) : (
                      <div className="space-y-3.5">
                        {itemsList.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl bg-surface-page/60 border border-border/60 hover:bg-white hover:border-primary-100 transition-all flex flex-col justify-between gap-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-body font-bold text-ink-primary">{item.name}</span>
                                  {renderDietBadge(item.type)}
                                </div>
                                {item.description && (
                                  <p className="text-caption text-ink-secondary mt-1">{item.description}</p>
                                )}
                              </div>

                              {item.calories && (
                                <span className="text-caption font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 flex items-center gap-1 whitespace-nowrap">
                                  <Flame size={12} />
                                  {item.calories} kcal
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between border-t border-border/40 pt-2 mt-1">
                              <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                                  <Star size={14} className="fill-amber-400" />
                                  <span>{item.avgRating ? item.avgRating.toFixed(1) : "4.0"}</span>
                                </div>
                                <span className="text-[11px] text-ink-muted">
                                  ({item.ratingCount || 100}+ reviews)
                                </span>
                              </div>

                              <Link
                                to="/feedback"
                                className="text-xs font-semibold text-secondary hover:text-secondary-hover bg-secondary-50 hover:bg-secondary-100/60 px-2.5 py-1 rounded-lg transition-colors"
                              >
                                Rate Dish
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FULL 7-DAY GRID VIEW */}
      {viewMode === "grid" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-h2 font-display text-ink-primary">7-Day Complete Overview</h2>
            <p className="text-xs text-ink-muted">Scroll horizontally to view all 7 days</p>
          </div>

          <div className="overflow-x-auto pb-4 rounded-2xl border border-border bg-white shadow-xs">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-surface-muted/80 text-ink-primary border-b border-border text-xs uppercase font-bold tracking-wider">
                  <th className="p-4 w-32">Day</th>
                  <th className="p-4">Breakfast 🌅</th>
                  <th className="p-4">Lunch ☀️</th>
                  <th className="p-4">Snacks ☕</th>
                  <th className="p-4">Dinner 🌙</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-body-sm">
                {weeklyMenu.map((dayData) => (
                  <tr key={dayData.dayId} className="hover:bg-primary-50/20 transition-colors">
                    <td className="p-4 font-extrabold text-primary align-top bg-surface-muted/30">
                      {dayData.day}
                    </td>

                    {["breakfast", "lunch", "snacks", "dinner"].map((mType) => {
                      const meal = dayData.meals.find((m) => m.mealType === mType);
                      const items = filterItems(meal?.items || []);

                      return (
                        <td key={mType} className="p-4 align-top max-w-[220px]">
                          <div className="space-y-1.5">
                            {items.map((i) => (
                              <div key={i.id} className="text-xs font-medium flex items-center justify-between gap-1">
                                <span className="text-ink-primary truncate">{i.name}</span>
                                <span className="text-[10px] text-amber-600 font-bold flex items-center">
                                  <Star size={10} className="fill-amber-400 mr-0.5" />
                                  {i.avgRating}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
