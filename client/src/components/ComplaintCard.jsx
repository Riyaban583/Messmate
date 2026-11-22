import React from "react";
import { AlertCircle, Clock, CheckCircle2, MessageSquare, UserCheck, ShieldAlert } from "lucide-react";
import { formatDate } from "../utils/formatDate";

export default function ComplaintCard({ complaint }) {
  const getStatusStep = (status) => {
    switch (status) {
      case "Pending":
      case "Submitted":
        return 1;
      case "Under Review":
        return 2;
      case "In Progress":
        return 3;
      case "Resolved":
        return 4;
      case "Rejected":
        return 0;
      default:
        return 2;
    }
  };

  const currentStep = getStatusStep(complaint.status);

  return (
    <div className="card space-y-3.5 border hover:border-border transition-all duration-200 bg-white">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-ink-primary bg-surface-muted px-2.5 py-0.5 rounded-lg border border-border/70">
              {complaint.category}
            </span>
            <span className="text-xs font-semibold text-ink-muted">Meal: {complaint.meal || "General"}</span>

            {/* Priority Pill */}
            {complaint.priority && (
              <span
                className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border shadow-2xs ${
                  complaint.priority === "Urgent"
                    ? "bg-rose-100 text-rose-800 border-rose-300"
                    : complaint.priority === "High"
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : "bg-surface-muted text-ink-secondary border-border/70"
                }`}
              >
                {complaint.priority} Priority
              </span>
            )}

            {complaint.isAnonymous && (
              <span className="text-[10px] font-semibold text-ink-muted bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                Anonymous
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-ink-primary font-display">{complaint.title}</h3>
          <p className="text-sm text-ink-secondary leading-relaxed">"{complaint.description}"</p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-medium text-ink-muted flex items-center gap-1">
            <Clock size={13} />
            {formatDate(complaint.createdAt || complaint.date)}
          </span>
        </div>
      </div>

      {/* Progress Timeline Stepper */}
      {complaint.status === "Rejected" ? (
        <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-bold">
          <ShieldAlert size={16} />
          <span>This complaint ticket was marked as Rejected by Admin.</span>
        </div>
      ) : (
        <div className="bg-surface-page/70 p-3 rounded-xl border border-border/60 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-ink-muted uppercase tracking-wider">
            <span>Ticket Resolution Progress</span>
            <span className="text-primary font-extrabold">{complaint.status}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-center">
            {[
              { step: 1, label: "Submitted" },
              { step: 2, label: "Review" },
              { step: 3, label: "In Progress" },
              { step: 4, label: "Resolved" },
            ].map((s) => {
              const isPassed = s.step <= currentStep;
              const isCurrent = s.step === currentStep;
              return (
                <div
                  key={s.step}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition-all ${
                    isCurrent
                      ? "bg-primary text-white border-primary shadow-xs"
                      : isPassed
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-white text-ink-muted border-border/60"
                  }`}
                >
                  {s.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Admin Official Response */}
      {complaint.adminResponse && (
        <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl text-xs space-y-1">
          <p className="font-bold text-amber-900 flex items-center gap-1.5">
            <MessageSquare size={14} className="text-amber-700" />
            Mess Management Response:
          </p>
          <p className="text-ink-primary text-xs pl-5 font-medium leading-normal">"{complaint.adminResponse}"</p>
        </div>
      )}
    </div>
  );
}
