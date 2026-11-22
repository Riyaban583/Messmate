import { useState, useEffect } from "react";
import StatusBadge from "../components/StatusBadge";
import { mockComplaints } from "../services/mockData";
import { complaintsApi } from "../services/api";
import { useToast } from "../context/ToastContext";
import { AlertCircle, CheckCircle2, MessageSquare, ShieldAlert, Clock, User } from "lucide-react";
import { formatDate } from "../utils/formatDate";

const statuses = ["Pending", "Under Review", "In Progress", "Resolved", "Rejected"];

export default function ManageComplaints() {
  const toast = useToast();
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await complaintsApi.adminList();
        if (res?.data) {
          setComplaints(res.data);
          return;
        }
      } catch (err) {
        // fallback
      }
      const stored = localStorage.getItem("messmate_complaints");
      setComplaints(stored ? JSON.parse(stored) : mockComplaints);
    };

    fetchComplaints();
  }, []);

  const handleUpdate = async (id, newStatus, newResponse) => {
    try {
      await complaintsApi.updateStatus(id, { status: newStatus, adminResponse: newResponse });
      toast.success(`Complaint #${id} updated to ${newStatus}`);
    } catch (err) {
      toast.success(`Status updated locally to ${newStatus}`);
    }

    setComplaints((prev) =>
      prev.map((c) => (c.id === id || c._id === id ? { ...c, status: newStatus, adminResponse: newResponse } : c))
    );
  };

  const visible = filter === "All" ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="card-glow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
            <ShieldAlert size={14} />
            <span>Admin Resolution Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-primary pt-1">
            Manage Student Complaints
          </h1>
          <p className="text-sm text-ink-secondary">
            Review submitted issues, change ticket status, and provide official responses to students.
          </p>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 flex-wrap bg-white p-3 rounded-2xl border border-border/80 shadow-2xs">
        {["All", ...statuses].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
              filter === s ? "border-primary text-white bg-primary shadow-xs" : "border-border text-ink-secondary hover:bg-surface-muted bg-surface-muted/40"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {visible.map((c) => (
          <div key={c.id || c._id} className="card space-y-3.5 bg-white border hover:border-border transition-all">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-border/60 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-ink-primary bg-surface-muted px-2.5 py-0.5 rounded-lg border border-border/70">
                    {c.category}
                  </span>
                  <span className="text-xs font-semibold text-ink-muted">Meal: {c.meal || "General"}</span>
                  {c.priority && (
                    <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                      {c.priority} Priority
                    </span>
                  )}
                  {c.isAnonymous && (
                    <span className="text-[10px] font-semibold text-ink-muted bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      Anonymous Ticket
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-ink-primary font-display pt-1">{c.title || c.description.slice(0, 50)}</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">"{c.description}"</p>
                <div className="flex items-center gap-2 text-[11px] text-ink-muted pt-1">
                  <User size={12} />
                  <span>Submitted by <strong>{c.isAnonymous ? "Anonymous Student" : (c.studentName || c.userName || "Student")}</strong></span>
                </div>
              </div>

              <div className="shrink-0">
                <StatusBadge status={c.status} />
              </div>
            </div>

            {/* Admin Response & Status Selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <select
                value={c.status}
                onChange={(e) => handleUpdate(c.id || c._id, e.target.value, c.adminResponse)}
                className="bg-surface-muted/50 border border-border rounded-xl px-3 py-2 text-xs font-bold text-ink-primary focus:outline-none focus:border-primary"
              >
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <input
                defaultValue={c.adminResponse}
                onBlur={(e) => handleUpdate(c.id || c._id, c.status, e.target.value)}
                placeholder="Type official response to student ticket..."
                className="flex-1 bg-surface-muted/40 border border-border rounded-xl px-3.5 py-2 text-xs text-ink-primary focus:outline-none focus:border-primary focus:bg-white"
              />
            </div>
          </div>
        ))}

        {visible.length === 0 && (
          <div className="card text-center py-10 text-ink-muted bg-white">
            <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-1" />
            <p className="font-bold text-sm">No complaints found in this status category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
