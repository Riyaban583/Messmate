import { useState, useEffect } from "react";
import { Plus, UserCheck, Lightbulb, Sparkles } from "lucide-react";
import FoodSuggestion from "../components/FoodSuggestion";
import { mockSuggestions } from "../services/mockData";
import { suggestionsApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

const categories = ["Breakfast", "Lunch", "Snacks", "Dinner", "Special Meal"];

export default function Suggestions() {
  const { user } = useAuth();
  const toast = useToast();
  
  const [suggestions, setSuggestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: categories[2], dietary: "Veg", description: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await suggestionsApi.list();
        if (res?.data) {
          setSuggestions(res.data);
          return;
        }
      } catch (err) {
        // fallback
      }
      setSuggestions(mockSuggestions);
    };

    fetchSuggestions();
  }, []);

  const handleVote = async (id) => {
    if (!user) {
      toast.warning("Please log in to upvote suggestions.");
      return;
    }

    try {
      const res = await suggestionsApi.vote(id);
      if (res?.data) {
        setSuggestions((prev) =>
          prev.map((item) => (item.id === id || item._id === id ? res.data : item))
        );
        toast.success(res.message || "Vote recorded!");
        return;
      }
    } catch (err) {
      // Local fallback upvote
    }

    const currentUserId = user.id || user._id || "user-local";
    setSuggestions((prev) =>
      prev.map((s) => {
        if (s.id === id || s._id === id) {
          const upvotes = s.upvotes || [];
          const hasVoted = upvotes.includes(currentUserId);
          const newUpvotes = hasVoted
            ? upvotes.filter((u) => u !== currentUserId)
            : [...upvotes, currentUserId];
          const newCount = hasVoted ? Math.max(0, (s.upvoteCount || s.votes || 0) - 1) : (s.upvoteCount || s.votes || 0) + 1;
          return { ...s, upvotes: newUpvotes, upvoteCount: newCount, votes: newCount };
        }
        return s;
      })
    );
    toast.success("Upvote updated!");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError("Please enter a title and description for your food suggestion.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const res = await suggestionsApi.submit(form);
      if (res?.data) {
        setSuggestions((prev) => [res.data, ...prev]);
        toast.success("Food suggestion submitted for community voting!");
      }
    } catch (err) {
      const newSuggestion = {
        id: `sug-${Date.now()}`,
        userId: user?.id || "user-1",
        submittedBy: user?.name || "Student",
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        dietary: form.dietary,
        status: "Under Review",
        upvotes: [user?.id || "user-1"],
        upvoteCount: 1,
        votes: 1,
        adminComment: "",
        createdAt: new Date().toISOString(),
      };
      setSuggestions((prev) => [newSuggestion, ...prev]);
      toast.success("Food suggestion recorded!");
    } finally {
      setSubmitting(false);
      setForm({ title: "", category: categories[2], dietary: "Veg", description: "" });
      setShowForm(false);
    }
  };

  const sorted = [...suggestions].sort((a, b) => (b.upvoteCount ?? b.votes ?? 0) - (a.upvoteCount ?? a.votes ?? 0));
  const currentUserId = user?.id || user?._id || "user-student-1";

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="card-glow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            <Lightbulb size={14} className="text-amber-600" />
            <span>Community Menu Polling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-primary pt-1">Food Suggestions</h1>
          <p className="text-sm text-ink-secondary">
            Propose new dishes you want added to the mess menu and upvote top student ideas.
          </p>
        </div>

        <button onClick={() => setShowForm((s) => !s)} className="btn-primary shadow-md self-start md:self-auto">
          <Plus size={18} />
          <span>Suggest New Food</span>
        </button>
      </div>

      {/* Suggestion Form Modal */}
      {showForm && (
        <form onSubmit={submit} className="card space-y-4 border-2 border-primary/30 bg-white shadow-xl animate-slide-up">
          <h2 className="text-lg font-bold font-display text-ink-primary border-b border-border/70 pb-2">
            Submit Food Dish Suggestion
          </h2>

          <div>
            <label className="text-xs font-bold block mb-1">Dish Name *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-surface-muted/40 border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-primary"
              placeholder="e.g. Pav Bhaji / Cold Coffee / Paneer Kathi Roll"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold block mb-1">Meal Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-surface-muted/40 border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Dietary Preference *</label>
              <select
                value={form.dietary}
                onChange={(e) => setForm({ ...form, dietary: e.target.value })}
                className="w-full bg-surface-muted/40 border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
              >
                {["Veg", "Non-Veg", "Jain", "Special"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Why should this be added? *</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full bg-surface-muted/40 border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
              placeholder="Explain why students will love this dish and when it should be served..."
            />
          </div>

          {error && <p className="text-xs font-bold text-danger">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-xs">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary text-xs shadow-md">
              <span>{submitting ? "Submitting..." : "Post Suggestion"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Suggestions Feed */}
      <div className="space-y-4">
        {sorted.map((s) => (
          <FoodSuggestion
            key={s.id || s._id}
            suggestion={s}
            currentUserId={currentUserId}
            onVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
}
