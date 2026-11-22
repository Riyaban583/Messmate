import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, MessageSquareWarning, Star, ClipboardList, ShieldCheck, ArrowRight, CalendarDays, Lightbulb, AlertCircle, Sparkles } from "lucide-react";
import KpiCard from "../components/KpiCard";
import { mockAdminKpis } from "../services/mockData";
import { analyticsApi } from "../services/api";

export default function AdminDashboard() {
  const [kpiData, setKpiData] = useState(mockAdminKpis);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await analyticsApi.summary();
        if (res?.data?.overview) {
          const ov = res.data.overview;
          setKpiData({
            totalStudents: 520,
            todaysFeedback: ov.totalFeedbackCount,
            averageRating: ov.averageRating,
            pendingComplaints: ov.pendingComplaints,
            totalComplaints: ov.totalComplaints,
            popularFood: "Chole Bhature",
            leastRatedFood: "Mix Veg Sabzi",
            participationRate: 68.4,
          });
        }
      } catch (err) {
        // fallback
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="card-glow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-50 text-secondary border border-secondary-100 text-xs font-bold">
            <ShieldCheck size={14} />
            <span>Hostel Mess Management Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-primary pt-1">
            Admin Control Hub
          </h1>
          <p className="text-sm text-ink-secondary">
            Convert student votes into clear decisions: keep, improve, or replace menu items.
          </p>
        </div>

        <Link to="/admin/menu" className="btn-primary flex items-center gap-2 self-start md:self-auto shadow-md">
          <CalendarDays size={16} />
          <span>Manage Weekly Menu</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Active Students" value={kpiData.totalStudents} icon={Users} />
        <KpiCard label="Total Feedbacks" value={kpiData.todaysFeedback} icon={ClipboardList} />
        <KpiCard label="Average Food Rating" value={`${kpiData.averageRating} ★`} icon={Star} />
        <KpiCard label="Pending Complaints" value={`${kpiData.pendingComplaints} / ${kpiData.totalComplaints}`} icon={MessageSquareWarning} />
      </div>

      {/* Highlights */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card bg-emerald-50/40 border-emerald-200/80">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Most Popular Dish 🔥</p>
          <p className="text-xl font-bold font-display text-emerald-900 mt-1">{kpiData.popularFood}</p>
          <p className="text-xs text-ink-secondary mt-1">Highest upvoted & rated dish this week.</p>
        </div>

        <div className="card bg-rose-50/40 border-rose-200/80">
          <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Needs Recipe Tuning ⚠️</p>
          <p className="text-xl font-bold font-display text-rose-900 mt-1">{kpiData.leastRatedFood}</p>
          <p className="text-xs text-ink-secondary mt-1">Lowest average score — recommended for recipe revision.</p>
        </div>
      </div>

      {/* Feedback Participation Rate */}
      <div className="card space-y-2.5 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold font-display text-ink-primary">Student Participation Target (≥60%)</h3>
            <p className="text-xs text-ink-muted">Weekly active student feedback engagement rate.</p>
          </div>
          <span className="text-sm font-extrabold text-primary">{kpiData.participationRate}%</span>
        </div>
        <div className="w-full h-3 bg-surface-muted rounded-full overflow-hidden flex">
          <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${kpiData.participationRate}%` }} />
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/admin/menu" className="card group hover:border-primary/40 transition-all bg-white">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <CalendarDays size={20} />
          </div>
          <h3 className="text-base font-bold text-ink-primary group-hover:text-primary transition-colors font-display">Manage Menu</h3>
          <p className="text-xs text-ink-secondary mt-1">Edit 7-day schedule, add dishes, and set meal timings.</p>
        </Link>

        <Link to="/admin/complaints" className="card group hover:border-rose-300 transition-all bg-white">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <AlertCircle size={20} />
          </div>
          <h3 className="text-base font-bold text-ink-primary group-hover:text-rose-600 transition-colors font-display">Manage Complaints</h3>
          <p className="text-xs text-ink-secondary mt-1">Review student tickets, assign status, and post responses.</p>
        </Link>

        <Link to="/admin/suggestions" className="card group hover:border-amber-300 transition-all bg-white">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Lightbulb size={20} />
          </div>
          <h3 className="text-base font-bold text-ink-primary group-hover:text-amber-600 transition-colors font-display">Manage Suggestions</h3>
          <p className="text-xs text-ink-secondary mt-1">Review community suggestions and approve top-voted dishes.</p>
        </Link>
      </div>
    </div>
  );
}
