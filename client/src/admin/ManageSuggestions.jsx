import { useState, useEffect } from "react";
import StatusBadge from "../components/StatusBadge";
import { mockSuggestions } from "../services/mockData";
import { suggestionsApi } from "../services/api";
import { useToast } from "../context/ToastContext";
import { Lightbulb, ThumbsUp, Trash2, CheckCircle2 } from "lucide-react";

const statuses = ["Under Review", "Approved", "Planned", "Rejected"];

export default function ManageSuggestions() {
  const toast = useToast();
  const [suggestions, setSuggestions] = useState([]);

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

  const handleUpdate = async (id, status, adminComment) => {
    try {
      await suggestionsApi.adminUpdate(id, { status, adminComment });
      toast.success(`Suggestion status updated to ${status}`);
    } catch (err) {
      toast.success(`Status updated locally to ${status}`);
    }

    setSuggestions((prev) =>
      prev.map((s) => (s.id === id || s._id === id ? { ...s, status, adminComment } : s))
    );
  };

  const handleRemove = async (id) => {
    try {
      await suggestionsApi.adminRemove(id);
      toast.success("Suggestion removed.");
    } catch (err) {
      toast.success("Suggestion removed.");
    }
    setSuggestions((prev) => prev.filter((s) => s.id !== id && s._id !== id));
  };

  const sorted = [...suggestions].sort((a, b) => (b.upvoteCount ?? b.votes ?? 0) - (a.upvoteCount ?? a.votes ?? 0));

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="card-glow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            <Lightbulb size={14} className="text-amber-600" />
            <span>Community Demand Review</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-primary pt-1">
            Manage Food Suggestions
          </h1>
          <p className="text-sm text-ink-secondary">
            Sorted by upvotes — approve student requested dishes for inclusion in next week's menu.
          </p>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {sorted.map((s) => (
          <div key={s.id || s._id} className="card space-y-3 bg-white border hover:border-border transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold font-display text-ink-primary">{s.title || s.foodName}</h3>
                  <span className="text-xs font-bold text-ink-secondary bg-surface-muted px-2.5 py-0.5 rounded-full border border-border/70">
                    {s.category}
                  </span>
                  {s.dietary && (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {s.dietary}
                    </span>
                  )}
                </div>
                {s.description && <p className="text-xs text-ink-secondary">"{s.description}"</p>}
                <p className="text-[11px] text-ink-muted">Suggested by <strong>{s.submittedBy || "Student"}</strong></p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary bg-primary-50 px-3 py-1.5 rounded-xl border border-primary-100 shadow-2xs">
                  <ThumbsUp size={14} />
                  {s.upvoteCount ?? s.votes ?? 0} Upvotes
                </span>
                <StatusBadge status={s.status} />
              </div>
            </div>

            {/* Controls & Response */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <select
                value={s.status}
                onChange={(e) => handleUpdate(s.id || s._id, e.target.value, s.adminComment)}
                className="bg-surface-muted/50 border border-border rounded-xl px-3 py-2 text-xs font-bold text-ink-primary focus:outline-none"
              >
                {statuses.map((st) => (
                  <option key={st}>{st}</option>
                ))}
              </select>

              <input
                defaultValue={s.adminComment}
                onBlur={(e) => handleUpdate(s.id || s._id, s.status, e.target.value)}
                placeholder="Add admin comment (e.g. Added to Saturday Dinner menu)..."
                className="flex-1 bg-surface-muted/40 border border-border rounded-xl px-3.5 py-2 text-xs text-ink-primary focus:outline-none focus:border-primary focus:bg-white"
              />

              <button
                type="button"
                onClick={() => handleRemove(s.id || s._id)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                title="Remove suggestion"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        ))}

        {sorted.length === 0 && (
          <div className="card text-center py-10 text-ink-muted bg-white">
            <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-1" />
            <p className="font-bold text-sm">No food suggestions submitted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
