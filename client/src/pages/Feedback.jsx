import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Clock, 
  UserCheck,
  Filter
} from "lucide-react";
import Rating from "../components/Rating";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { 
  getStoredWeeklyMenu, 
  saveWeeklyMenu, 
  getStoredFeedbacks, 
  saveFeedbacks 
} from "../services/mockData";
import { feedbackApi, menuApi } from "../services/api";

const aspectTags = [
  "😋 Delicious",
  "🧂 Needs Salt",
  "🌶️ Too Spicy",
  "❄️ Served Cold",
  "🥗 Fresh Quality",
  "🥄 Small Portion",
  "🛢️ Too Oily",
  "🧼 Clean Presentation",
  "⭐ Perfect Portion",
  "👍 Highly Recommended"
];

export default function Feedback() {
  const { user } = useAuth();
  const toast = useToast();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("today");
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  
  // Rating modal states
  const [selectedDish, setSelectedDish] = useState(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [submittedDishIds, setSubmittedDishIds] = useState([]);

  // Overall meal rating states
  const [selectedMealType, setSelectedMealType] = useState("Lunch");
  const [mealRating, setMealRating] = useState(4);
  const [mealComment, setMealComment] = useState("");
  const [mealSubmitted, setMealSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await feedbackApi.mine();
        if (res?.data) {
          setFeedbacks(res.data);
        } else {
          setFeedbacks(getStoredFeedbacks());
        }
      } catch (err) {
        setFeedbacks(getStoredFeedbacks());
      }
      setWeeklyMenu(getStoredWeeklyMenu());
    };

    fetchData();

    // If redirected with state
    if (location.state?.dishName) {
      setSelectedDish({
        id: `dish-nav-${Date.now()}`,
        name: location.state.dishName,
        mealType: location.state.mealType || "Lunch",
      });
      setActiveTab("today");
    }
  }, [location.state]);

  const currentDayIndex = new Date().getDay();
  const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const todayId = dayMap[currentDayIndex] || "mon";
  const todayData = weeklyMenu.find((d) => d.dayId === todayId) || weeklyMenu[0];

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleDishRatingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDish || !ratingScore) return;

    const payload = {
      foodName: selectedDish.name,
      mealType: selectedDish.mealType || "Lunch",
      rating: ratingScore,
      comment: `${selectedTags.join(" • ")} ${commentText}`.trim(),
    };

    try {
      await feedbackApi.submit(payload);
      toast.success(`Feedback for ${selectedDish.name} saved!`);
    } catch (err) {
      // Local fallback
      const newFeedback = {
        id: `fb-${Date.now()}`,
        userName: user?.name || "Student",
        userRole: user?.role === "admin" ? "Staff / Admin" : "Student",
        dishId: selectedDish.id,
        dishName: selectedDish.name,
        rating: ratingScore,
        tags: selectedTags,
        comment: commentText.trim() || "Rated dish.",
        date: new Date().toISOString().slice(0, 10),
        mealType: selectedDish.mealType || "Lunch",
      };

      const updatedFeedbacks = [newFeedback, ...feedbacks];
      setFeedbacks(updatedFeedbacks);
      saveFeedbacks(updatedFeedbacks);
      toast.success(`Feedback for ${selectedDish.name} recorded!`);
    }

    setSubmittedDishIds((prev) => [...prev, selectedDish.id]);
    setSelectedDish(null);
    setRatingScore(5);
    setSelectedTags([]);
    setCommentText("");
  };

  const handleMealSubmit = async (e) => {
    e.preventDefault();
    if (!mealRating) return;

    try {
      await feedbackApi.submit({
        foodName: `Overall ${selectedMealType} Service`,
        mealType: selectedMealType,
        rating: mealRating,
        comment: mealComment.trim(),
      });
      toast.success(`Overall ${selectedMealType} review submitted!`);
    } catch (err) {
      const mealFeedback = {
        id: `meal-fb-${Date.now()}`,
        userName: user?.name || "Student",
        userRole: "Student",
        dishName: `Overall ${selectedMealType} Service`,
        rating: mealRating,
        tags: ["Overall Experience"],
        comment: mealComment.trim() || `Rated overall ${selectedMealType} service.`,
        date: new Date().toISOString().slice(0, 10),
        mealType: selectedMealType,
      };

      const updated = [mealFeedback, ...feedbacks];
      setFeedbacks(updated);
      saveFeedbacks(updated);
      toast.success(`Overall ${selectedMealType} review saved!`);
    }

    setMealSubmitted(true);
    setTimeout(() => setMealSubmitted(false), 3000);
    setMealComment("");
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Page Header */}
      <div className="card-glow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            <Star size={14} className="fill-amber-400 text-amber-500" />
            <span>Interactive Student Feedback Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-primary pt-1">Rate & Feedback Hub</h1>
          <p className="text-sm text-ink-secondary">
            Rate today's meals, write dish reviews, and shape campus mess decisions.
          </p>
        </div>

        {user?.email && (
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-border text-xs font-medium text-ink-secondary shadow-2xs">
            <UserCheck size={16} className="text-secondary shrink-0" />
            <span>Signed in as <strong>{user.name}</strong> ({user.email})</span>
          </div>
        )}
      </div>

      {/* Tab Selector */}
      <div className="card p-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-white">
        {[
          { id: "today", label: "Rate Today's Dishes 🍽️" },
          { id: "meal", label: "Rate Overall Meal 🍱" },
          { id: "catalog", label: "Community Reviews 💬" },
          { id: "history", label: "My Feedback History 📜" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-md shadow-primary-500/20"
                : "text-ink-secondary hover:text-ink-primary hover:bg-surface-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: RATE TODAY'S DISHES */}
      {activeTab === "today" && todayData && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold font-display text-ink-primary">
              Today's Served Dishes ({todayData.day})
            </h2>
            <p className="text-xs text-ink-secondary">Select any dish to submit your star rating and aspect tags.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {(todayData.meals || []).flatMap((meal) =>
              (meal.items || []).map((item, idx) => {
                const isDone = submittedDishIds.includes(item.id);
                return (
                  <div
                    key={item.id || idx}
                    className={`card flex flex-col justify-between gap-3 border transition-all duration-200 ${
                      isDone ? "bg-emerald-50/40 border-emerald-200" : "hover:border-primary/40 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] uppercase font-extrabold text-ink-muted bg-surface-muted px-2.5 py-0.5 rounded-md">
                          {meal.mealType}
                        </span>
                        <h3 className="text-base font-bold text-ink-primary mt-1.5 font-display">{item.name}</h3>
                        {item.description && (
                          <p className="text-xs text-ink-secondary mt-0.5">{item.description}</p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <div className="flex items-center justify-end gap-1 text-amber-700 font-bold text-xs">
                          <Star size={14} className="fill-amber-400 text-amber-500" />
                          <span>{item.avgRating ? Number(item.avgRating).toFixed(1) : "4.0"}</span>
                        </div>
                        <span className="text-[10px] text-ink-muted">{item.ratingCount || 100} votes</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                      {isDone ? (
                        <span className="badge badge-veg inline-flex items-center gap-1 text-xs">
                          <CheckCircle2 size={14} /> Rating Recorded
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedDish({ ...item, mealType: meal.mealType })}
                          className="btn-primary w-full sm:w-auto text-xs"
                        >
                          <Star size={14} />
                          <span>Rate This Dish</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* RATING MODAL WHEN DISH IS SELECTED */}
      {selectedDish && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-border space-y-5 animate-slide-up">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <div>
                <span className="text-[11px] uppercase font-extrabold text-primary bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100">
                  {selectedDish.mealType} Dish Rating
                </span>
                <h3 className="text-xl font-display font-extrabold text-ink-primary mt-1">
                  {selectedDish.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDish(null)}
                className="text-ink-muted hover:text-ink-primary font-bold text-lg p-1.5 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDishRatingSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-ink-primary block mb-2">
                  Rating Score (1–5 Stars)
                </label>
                <Rating value={ratingScore} onChange={setRatingScore} size={28} showLabel={true} />
              </div>

              <div>
                <label className="text-xs font-bold text-ink-primary block mb-2">
                  Select Feedback Tags (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {aspectTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary text-white border-primary shadow-xs"
                            : "bg-surface-muted text-ink-secondary border-border/80 hover:bg-white"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-ink-primary block">
                    Review / Suggestion
                  </label>
                  <span className="text-[11px] text-ink-muted">{commentText.length}/300</span>
                </div>
                <textarea
                  value={commentText}
                  maxLength={300}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  placeholder="Share feedback on taste, portion size, seasoning, hygiene..."
                  className="w-full bg-surface-muted/40 border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDish(null)}
                  className="btn-outline text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs shadow-md">
                  <Send size={15} />
                  <span>Submit Rating</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: OVERALL MEAL */}
      {activeTab === "meal" && (
        <div className="card space-y-5 max-w-2xl mx-auto bg-white">
          <div className="border-b border-border/70 pb-3">
            <h2 className="text-lg font-bold font-display text-ink-primary">Rate Overall Meal Experience</h2>
            <p className="text-xs text-ink-secondary mt-1">
              Feedback on mess counter speed, food freshness, and dining hygiene today.
            </p>
          </div>

          {mealSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-center space-y-1">
              <CheckCircle2 size={24} className="mx-auto text-emerald-600 mb-1" />
              <p className="font-bold text-sm">Thank you for rating overall {selectedMealType}!</p>
              <p className="text-xs text-emerald-700">Your review was sent to mess management.</p>
            </div>
          ) : (
            <form onSubmit={handleMealSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1.5">Select Meal Service</label>
                <div className="flex gap-2">
                  {["Breakfast", "Lunch", "Snacks", "Dinner"].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setSelectedMealType(m)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedMealType === m
                          ? "bg-primary text-white border-primary shadow-xs"
                          : "bg-surface-muted text-ink-secondary border-border"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1.5">Meal Service Rating</label>
                <Rating value={mealRating} onChange={setMealRating} size={28} />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1.5">Comment on Service & Hygiene</label>
                <textarea
                  value={mealComment}
                  maxLength={300}
                  onChange={(e) => setMealComment(e.target.value)}
                  rows={3}
                  placeholder="How was counter speed, queue management, cleanliness today?"
                  className="w-full bg-surface-muted/40 border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <button type="submit" className="btn-primary w-full text-xs shadow-md">
                <Send size={15} />
                <span>Submit Overall Meal Review</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 3: COMMUNITY REVIEWS */}
      {activeTab === "catalog" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-ink-primary">Student Reviews & Community Feed</h2>
            <span className="text-xs font-bold text-ink-muted bg-surface-muted px-3 py-1 rounded-full border border-border">
              {feedbacks.length} Reviews
            </span>
          </div>

          <div className="space-y-3">
            {feedbacks.map((fb) => (
              <div key={fb.id || fb._id} className="card space-y-2.5 hover:border-border transition-all bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink-primary text-sm">{fb.userName}</span>
                      <span className="text-[10px] font-semibold text-ink-muted bg-surface-muted px-2 py-0.5 rounded-md border border-border/60">
                        {fb.userRole || "Student"}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-primary mt-0.5">
                      Dish: {fb.dishName || fb.foodName} ({fb.mealType || "General"})
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-amber-700 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <Star size={13} className="fill-amber-400 text-amber-500" />
                    <span>{fb.rating}.0 / 5</span>
                  </div>
                </div>

                <p className="text-xs text-ink-primary bg-surface-page/70 p-3 rounded-xl border border-border/60 leading-relaxed">
                  "{fb.comment}"
                </p>

                {fb.tags && fb.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {fb.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold text-ink-secondary bg-surface-muted px-2 py-0.5 rounded-md border border-border/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-[11px] text-ink-muted flex items-center justify-end gap-1 pt-1">
                  <Clock size={12} />
                  <span>Posted on {fb.date || "Today"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MY HISTORY */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-display text-ink-primary">My Submitted Feedback</h2>
          {feedbacks.filter((f) => f.userName === (user?.name || "Student")).length === 0 ? (
            <div className="card text-center py-10 text-ink-muted bg-white">
              <MessageSquare size={36} className="mx-auto opacity-40 mb-2 text-primary" />
              <p className="font-bold text-sm">No feedback submitted yet.</p>
              <p className="text-xs">Your ratings and reviews will show up here once submitted.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedbacks
                .filter((f) => f.userName === (user?.name || "Student"))
                .map((fb) => (
                  <div key={fb.id || fb._id} className="card space-y-2 bg-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-ink-primary">{fb.dishName || fb.foodName}</h3>
                      <div className="flex items-center gap-1 text-amber-700 font-bold text-xs">
                        <Star size={13} className="fill-amber-400 text-amber-500" />
                        <span>{fb.rating} / 5</span>
                      </div>
                    </div>
                    <p className="text-xs text-ink-secondary">"{fb.comment}"</p>
                    <span className="text-[11px] text-ink-muted block text-right">{fb.date || "Today"}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
