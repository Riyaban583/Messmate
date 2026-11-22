import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { 
  CalendarDays, 
  Star, 
  UtensilsCrossed, 
  AlertCircle, 
  Lightbulb, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  Clock,
  ChevronRight
} from "lucide-react";
import Rating from "../components/Rating";
import { getStoredWeeklyMenu, saveFeedbacks, getStoredFeedbacks } from "../services/mockData";
import { feedbackApi, menuApi } from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();
  
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [todayMenu, setTodayMenu] = useState(null);
  const [todayName, setTodayName] = useState("Monday");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await menuApi.today();
        if (res?.data) {
          setTodayMenu(res.data);
          setTodayName(res.data.day || "Today");
        } else {
          loadMockFallback();
        }
      } catch (err) {
        loadMockFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadMockFallback = () => {
      const weeklyData = getStoredWeeklyMenu();
      const currentDayIndex = new Date().getDay();
      const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      const todayId = dayMap[currentDayIndex] || "mon";
      const dayObj = weeklyData.find((d) => d.dayId === todayId) || weeklyData[0];
      setTodayMenu(dayObj);
      setTodayName(dayObj.day);
    };

    fetchMenu();
  }, []);

  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  let activeMealSlot = "breakfast";
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
    activeMealSlot = "lunch";
  } else if (currentHour >= 17 && currentHour < 20) {
    greeting = "Good evening";
    activeMealSlot = "snacks";
  } else if (currentHour >= 20 || currentHour < 5) {
    greeting = "Good evening";
    activeMealSlot = "dinner";
  }

  const activeMealData =
    todayMenu?.meals?.[activeMealSlot] ||
    (Array.isArray(todayMenu?.meals) ? todayMenu.meals.find((m) => m.mealType === activeMealSlot) : null) ||
    (todayMenu?.meals ? Object.values(todayMenu.meals)[0] : null);

  const handleQuickRatingSubmit = async () => {
    if (!rating) return;
    try {
      await feedbackApi.submit({
        foodName: `Today's ${activeMealSlot.toUpperCase()} Meal`,
        mealType: activeMealSlot.toUpperCase(),
        rating,
        comment: `Rated today's ${activeMealSlot} service ${rating} stars on Dashboard.`,
      });
      toast.success(`Rating of ${rating} stars saved!`);
    } catch (err) {
      // Local fallback store
      const newFeedback = {
        id: `fb-dash-${Date.now()}`,
        userName: user?.name || "Student",
        userRole: "Student",
        dishName: `Today's ${activeMealSlot.toUpperCase()} Meal`,
        rating,
        comment: `Rated today's ${activeMealSlot} service ${rating} stars.`,
        date: new Date().toISOString().slice(0, 10),
        mealType: activeMealSlot,
      };
      const currentList = getStoredFeedbacks();
      saveFeedbacks([newFeedback, ...currentList]);
      toast.success(`Rating of ${rating} stars saved locally!`);
    }
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Welcome Banner */}
      <div className="card-glow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-50 px-3 py-1 rounded-full border border-primary-100/80">
              Campus Mess Active
            </span>
            <span className="text-xs text-ink-muted flex items-center gap-1">
              <Clock size={13} />
              {todayName}, {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-primary pt-1">
            {greeting}, {user?.name || "Student"} 👋
          </h1>
          <p className="text-sm text-ink-secondary">
            Here's today's meal schedule, quick ratings, and feedback portal.
          </p>
        </div>

        {/* Quick Link to 1-Week Menu */}
        <Link to="/weekly-menu" className="btn-primary flex items-center gap-2 whitespace-nowrap self-start md:self-auto shadow-md">
          <CalendarDays size={18} />
          <span>Access 1-Week Menu</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Featured Meal Card */}
      {activeMealData && (
        <div className="card bg-gradient-to-br from-white via-white to-orange-50/40 border-primary/20 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase text-secondary tracking-wider bg-secondary-50 px-3 py-1 rounded-full border border-secondary-100">
                Active Service • {activeMealSlot}
              </span>
              <h2 className="text-xl font-display font-bold text-ink-primary mt-1.5">
                Now Serving: {activeMealSlot.toUpperCase()}
              </h2>
            </div>

            {activeMealData.time && (
              <span className="text-xs font-bold text-ink-muted flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-border/70 shadow-2xs">
                <Clock size={14} className="text-primary" />
                {activeMealData.time}
              </span>
            )}
          </div>

          {/* Dish List */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(activeMealData.items || []).map((item, idx) => (
              <div
                key={item.id || item._id || idx}
                className="p-3.5 rounded-xl bg-white border border-border/80 shadow-2xs hover:border-primary/40 transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-sm text-ink-primary">{item.name}</span>
                  {(item.type === "special" || item.dietary === "Special") && (
                    <Sparkles size={14} className="text-amber-500 shrink-0" />
                  )}
                </div>
                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/50 text-xs text-ink-muted">
                  <span className="flex items-center gap-1 text-amber-700 font-bold">
                    <Star size={12} className="fill-amber-400 text-amber-500" />
                    {item.avgRating ? Number(item.avgRating).toFixed(1) : "4.2"}
                  </span>
                  {item.calories && (
                    <span className="flex items-center gap-0.5 text-amber-800 font-semibold">
                      <Flame size={12} className="text-amber-600" /> {item.calories} cal
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Feedback Widget */}
      <div className="card space-y-4 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold font-display text-ink-primary">One-Tap Quick Meal Rating</h2>
            <p className="text-xs text-ink-secondary">How was today's {activeMealSlot} service?</p>
          </div>
          <Link to="/feedback" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            Detailed Feedback <ChevronRight size={14} />
          </Link>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">Thank you! Your rating has been recorded in student statistics.</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-page/70 border border-border/70">
            <Rating value={rating} onChange={setRating} size={26} showLabel={true} />
            <button onClick={handleQuickRatingSubmit} className="btn-primary shadow-md">
              <Star size={16} />
              <span>Submit Rating</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of Quick Actions & Links */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/weekly-menu" className="card group hover:border-primary/40 transition-all duration-200">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <CalendarDays size={20} />
          </div>
          <h3 className="text-base font-bold text-ink-primary group-hover:text-primary transition-colors font-display">
            1-Week Full Menu
          </h3>
          <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
            View Monday to Sunday complete dishes, nutritional calories, and dietary info.
          </p>
        </Link>

        <Link to="/complaints" className="card group hover:border-rose-300 transition-all duration-200">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <AlertCircle size={20} />
          </div>
          <h3 className="text-base font-bold text-ink-primary group-hover:text-rose-600 transition-colors font-display">
            Report Complaint
          </h3>
          <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
            Report food quality or hygiene issues and track admin ticket status live.
          </p>
        </Link>

        <Link to="/suggestions" className="card group hover:border-amber-300 transition-all duration-200">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Lightbulb size={20} />
          </div>
          <h3 className="text-base font-bold text-ink-primary group-hover:text-amber-600 transition-colors font-display">
            Food Suggestions
          </h3>
          <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
            Suggest new dishes and upvote items submitted by fellow hostelites.
          </p>
        </Link>
      </div>
    </div>
  );
}
