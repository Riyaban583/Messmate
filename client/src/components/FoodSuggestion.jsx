import React from "react";
import { ThumbsUp, Sparkles, CheckCircle2, Heart, User, MessageSquare } from "lucide-react";

export default function FoodSuggestion({ suggestion, currentUserId, onVote }) {
  const isVoted = suggestion.upvotes && suggestion.upvotes.includes(currentUserId);
  const upvoteCount = suggestion.upvoteCount ?? (suggestion.votes || 0);

  return (
    <div className="card space-y-3.5 border hover:border-primary-100 transition-all duration-200 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold font-display text-ink-primary">
              {suggestion.foodName || suggestion.title}
            </h3>
            <span className="text-xs font-bold text-ink-secondary bg-surface-muted px-2.5 py-0.5 rounded-full border border-border/70">
              {suggestion.category}
            </span>
            {suggestion.dietary && (
              <span className={`badge ${suggestion.dietary === "Veg" ? "badge-veg" : suggestion.dietary === "Non-Veg" ? "badge-nonveg" : "badge-special"}`}>
                {suggestion.dietary}
              </span>
            )}
            <span
              className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border shadow-2xs ${
                suggestion.status === "Approved" || suggestion.status === "Planned"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : suggestion.status === "Rejected"
                  ? "bg-rose-100 text-rose-800 border-rose-300"
                  : "bg-amber-100 text-amber-800 border-amber-300"
              }`}
            >
              {suggestion.status}
            </span>
          </div>

          {suggestion.description && (
            <p className="text-sm text-ink-secondary leading-relaxed">"{suggestion.description}"</p>
          )}

          <div className="flex items-center gap-2 text-xs text-ink-muted pt-1">
            <span className="flex items-center gap-1 font-medium">
              <User size={13} />
              Suggested by {suggestion.submittedBy || suggestion.userName || "Student"}
            </span>
          </div>
        </div>

        {/* Upvote Button */}
        <div className="self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={() => onVote?.(suggestion.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isVoted
                ? "bg-primary text-white shadow-primary-500/25 scale-[1.03]"
                : "bg-surface-muted text-ink-secondary hover:bg-primary-50 hover:text-primary border border-border/70"
            }`}
          >
            <ThumbsUp size={16} className={isVoted ? "fill-white" : ""} />
            <span>{upvoteCount} Upvotes</span>
          </button>
        </div>
      </div>

      {/* Admin response or status note */}
      {suggestion.adminComment && (
        <div className="bg-emerald-50/80 border border-emerald-200/80 p-2.5 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
          <Sparkles size={15} className="text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold">Admin Note:</span> {suggestion.adminComment}
          </div>
        </div>
      )}
    </div>
  );
}
