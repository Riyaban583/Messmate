import { useState, useEffect } from "react";
import { Plus, Search, CheckCircle2, ShieldAlert, Lock } from "lucide-react";
import ComplaintCard from "../components/ComplaintCard";
import { mockComplaints } from "../services/mockData";
import { complaintsApi } from "../services/api";
import { useToast } from "../context/ToastContext";

const categories = ["Food Quality", "Hygiene", "Quantity", "Staff Behavior", "Timing", "Other"];
const meals = ["Breakfast", "Lunch", "Snacks", "Dinner", "General"];
const priorities = ["Low", "Medium", "High", "Urgent"];

export default function Complaints() {
  const toast = useToast();
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [form, setForm] = useState({
    title: "",
    category: categories[0],
    meal: meals[1],
    description: "",
    priority: "Medium",
    isAnonymous: false,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await complaintsApi.mine();
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

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError("Please provide both a title and detailed description.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const res = await complaintsApi.submit(form);
      if (res?.data) {
        setComplaints((prev) => [res.data, ...prev]);
        toast.success("Complaint ticket submitted successfully!");
      }
    } catch (err) {
      const newComplaint = {
        id: `cmp-${Date.now()}`,
        ...form,
        status: "Pending",
        adminResponse: "",
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setComplaints((prev) => [newComplaint, ...prev]);
      localStorage.setItem("messmate_complaints", JSON.stringify([newComplaint, ...complaints]));
      toast.success("Complaint ticket created locally!");
    } finally {
      setSubmitting(false);
      setForm({ title: "", category: categories[0], meal: meals[1], description: "", priority: "Medium", isAnonymous: false });
      setShowForm(false);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const titleMatch = (c.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (c.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = (c.category || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSearch = titleMatch || descMatch || catMatch;
    const matchesStatus = statusFilter === "all" ? true : (c.status || "").toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="card-glow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
            <ShieldAlert size={14} />
            <span>Official Mess Issue Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-primary pt-1">Complaints & Grievances</h1>
          <p className="text-sm text-ink-secondary">
            Report food quality, hygiene, or service issues and track real-time resolution from mess staff.
          </p>
        </div>

        <button onClick={() => setShowForm((s) => !s)} className="btn-primary shadow-md self-start md:self-auto">
          <Plus size={18} />
          <span>File New Complaint Ticket</span>
        </button>
      </div>

      {/* New Complaint Form */}
      {showForm && (
        <form onSubmit={submit} className="card space-y-4 border-2 border-primary/30 bg-white shadow-xl animate-slide-up">
          <h2 className="text-lg font-bold font-display text-ink-primary border-b border-border/70 pb-2">
            Submit Mess Grievance Ticket
          </h2>

          <div>
            <label className="text-xs font-bold block mb-1">Issue Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-surface-muted/40 border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-primary"
              placeholder="e.g. Undercooked Rice / Unwashed Cutlery at Breakfast Counter"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold block mb-1">Category *</label>
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
              <label className="text-xs font-bold block mb-1">Affected Meal *</label>
              <select
                value={form.meal}
                onChange={(e) => setForm({ ...form, meal: e.target.value })}
                className="w-full bg-surface-muted/40 border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
              >
                {meals.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Detailed Description *</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full bg-surface-muted/40 border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
              placeholder="Explain the problem clearly (e.g. temperature, hygiene issue, counter delay)..."
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="text-xs font-bold block mb-1.5">Priority Level</label>
              <div className="flex gap-2">
                {priorities.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setForm({ ...form, priority: p })}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      form.priority === p
                        ? "border-primary text-white bg-primary shadow-xs"
                        : "border-border text-ink-secondary bg-surface-muted"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-ink-secondary cursor-pointer select-none bg-surface-muted p-2 rounded-xl border border-border/70">
              <input
                type="checkbox"
                checked={form.isAnonymous}
                onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <Lock size={14} className="text-ink-muted" />
              <span>Submit Anonymously</span>
            </label>
          </div>

          {error && <p className="text-xs font-bold text-danger">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-xs">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary text-xs shadow-md">
              <span>{submitting ? "Submitting..." : "Submit Complaint Ticket"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="card flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search submitted complaints..."
            className="w-full bg-surface-muted/40 border border-border/80 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Tickets" },
            { id: "pending", label: "Pending" },
            { id: "progress", label: "In Progress" },
            { id: "resolved", label: "Resolved" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st.id
                  ? "bg-primary-50 text-primary border-primary-200"
                  : "bg-white text-ink-secondary border-border/80 hover:bg-surface-muted"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <div className="card text-center py-10 text-ink-muted space-y-1 bg-white">
            <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-1" />
            <p className="font-bold text-ink-primary text-sm">No complaints match active filter.</p>
            <p className="text-xs">All mess services are operating smoothly.</p>
          </div>
        ) : (
          filteredComplaints.map((c) => <ComplaintCard key={c.id || c._id} complaint={c} />)
        )}
      </div>
    </div>
  );
}
