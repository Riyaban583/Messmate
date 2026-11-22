import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuCard from "../components/MenuCard";
import { CalendarDays, ArrowRight, Star, Clock, Filter } from "lucide-react";
import { getStoredWeeklyMenu } from "../services/mockData";
import { menuApi } from "../services/api";

export default function Menu() {
  const navigate = useNavigate();
  const [todayData, setTodayData] = useState(null);
  const [dietaryFilter, setDietaryFilter] = useState("all");

  useEffect(() => {
    const fetchToday = async () => {
      try {
        const res = await menuApi.today();
        if (res?.data) {
          setTodayData(res.data);
          return;
        }
      } catch (err) {
        // fallback
      }
      const weeklyData = getStoredWeeklyMenu();
      const currentDayIndex = new Date().getDay();
      const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      const todayId = dayMap[currentDayIndex] || "mon";
      const dayObj = weeklyData.find((d) => d.dayId === todayId) || weeklyData[0];
      setTodayData(dayObj);
    };

    fetchToday();
  }, []);

  const handleRateClick = (dishName, mealType) => {
    navigate("/feedback", { state: { dishName, mealType } });
  };

  const getFilteredMeals = () => {
    if (!todayData?.meals) return [];
    
    // Normalize if array or object
    const rawMeals = Array.isArray(todayData.meals)
      ? todayData.meals
      : Object.entries(todayData.meals).map(([key, val]) => ({ mealType: key, ...val }));

    if (dietaryFilter === "all") return rawMeals;

    return rawMeals.map((meal) => ({
      ...meal,
      items: (meal.items || []).filter((item) => {
        const itemType = (item.dietary || item.type || "Veg").toLowerCase();
        if (dietaryFilter === "veg") return itemType === "veg" || itemType === "jain";
        if (dietaryFilter === "nonveg") return itemType === "non-veg";
        return true;
      }),
    }));
  };

  const mealsToDisplay = getFilteredMeals();

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="card-glow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary border border-primary-100 text-xs font-bold">
            <Clock size={14} />
            <span>{todayData?.day || "Today"}'s Mess Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-primary pt-1">
            Today's Served Menu
          </h1>
          <p className="text-sm text-ink-secondary">
            Real-time average student ratings per dish across Breakfast, Lunch, Evening Snacks, and Dinner.
          </p>
        </div>

        {/* Access 1-Week Menu Button */}
        <Link to="/weekly-menu" className="btn-primary flex items-center gap-2 whitespace-nowrap self-start md:self-auto shadow-md">
          <CalendarDays size={18} />
          <span>Access 1-Week Full Menu</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Dietary Filter Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-border/80 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-ink-muted shrink-0" />
          <span className="text-xs font-bold text-ink-secondary hidden sm:inline">Dietary Preference:</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[
            { id: "all", label: "All Items" },
            { id: "veg", label: "Veg / Jain" },
            { id: "nonveg", label: "Non-Veg Only" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDietaryFilter(tab.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                dietaryFilter === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface-muted text-ink-secondary hover:bg-surface-page"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {mealsToDisplay.map((meal) => (
          <MenuCard
            key={meal.mealType}
            mealType={meal.mealType}
            items={meal.items}
            time={meal.time}
            onRateClick={handleRateClick}
          />
        ))}
      </div>

      {/* Give Dish Feedback Banner */}
      <div className="card bg-gradient-to-r from-surface-muted via-white to-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
        <div>
          <h3 className="text-base font-bold text-ink-primary font-display">Have feedback on today's food?</h3>
          <p className="text-xs text-ink-secondary">Rate individual dishes or submit detailed suggestions to mess management.</p>
        </div>
        <Link to="/feedback" className="btn-secondary whitespace-nowrap shadow-xs">
          <Star size={16} className="text-amber-500 fill-amber-400" />
          <span>Submit Dish Feedback</span>
        </Link>
      </div>
    </div>
  );
}
