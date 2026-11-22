import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { mockFoodRatings, mockComplaints, getStoredFeedbacks } from "../services/mockData";
import { analyticsApi } from "../services/api";
import { Star, Sparkles, AlertTriangle, TrendingUp, Download, CheckCircle2 } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Analytics() {
  const toast = useToast();
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsApi.summary();
        if (res?.data) {
          setAnalyticsData(res.data);
        }
      } catch (err) {
        // fallback
      }
    };
    fetchAnalytics();
  }, []);

  const complaintsByCategory = Object.values(
    mockComplaints.reduce((acc, c) => {
      acc[c.category] = acc[c.category] || { category: c.category, count: 0 };
      acc[c.category].count += 1;
      return acc;
    }, {})
  );

  const topRated = analyticsData?.topFoodItems || [...mockFoodRatings].sort((a, b) => b.avgRating - a.avgRating).slice(0, 4);
  const lowestRated = analyticsData?.bottomFoodItems || [...mockFoodRatings].sort((a, b) => a.avgRating - b.avgRating).slice(0, 3);

  const handleExportCSV = () => {
    const csvRows = [];
    csvRows.push("Item Name,Category,Average Rating");
    mockFoodRatings.forEach((item) => {
      csvRows.push(`"${item.name}","${item.category || "General"}",${item.avgRating}`);
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `MessMate_Analytics_Report_${new Date().toISOString().split("T")[0]}.csv`);
    a.click();

    toast.success("Analytics CSV report exported successfully!");
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="card-glow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            <Sparkles size={14} className="text-amber-600" />
            <span>Executive Analytics & Quality Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-primary pt-1">
            Mess Quality & Feedback Analytics
          </h1>
          <p className="text-sm text-ink-secondary">
            Student satisfaction benchmarks, dish performance leaderboards, and complaint distributions.
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn-primary shadow-md flex items-center gap-2 self-start md:self-auto">
          <Download size={16} />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Leaderboard Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Rated */}
        <div className="card border-emerald-200/90 bg-emerald-50/30 space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-2.5">
            <h3 className="text-base font-bold text-emerald-900 font-display flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-600" />
              Highest Rated Dishes ⭐
            </h3>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Student Favorites
            </span>
          </div>
          <div className="space-y-2">
            {topRated.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-white border border-emerald-200/70 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-extrabold">
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-sm text-ink-primary">{item.name}</span>
                </div>
                <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                  <Star size={12} className="fill-amber-400 text-amber-500" />
                  {Number(item.rating || item.avgRating || 4.8).toFixed(1)} / 5.0
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Improvement */}
        <div className="card border-rose-200/90 bg-rose-50/30 space-y-3">
          <div className="flex items-center justify-between border-b border-rose-200 pb-2.5">
            <h3 className="text-base font-bold text-rose-900 font-display flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-600" />
              Dishes Needing Recipe Review
            </h3>
            <span className="text-xs font-extrabold text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full border border-rose-200">
              Action Priority
            </span>
          </div>
          <div className="space-y-2">
            {lowestRated.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-white border border-rose-200/70 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center text-xs font-extrabold">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-sm text-ink-primary">{item.name}</p>
                    {item.primaryComplaint && (
                      <p className="text-[10px] text-rose-600 font-medium">{item.primaryComplaint}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs font-extrabold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1">
                  <Star size={12} className="fill-rose-400 text-rose-500" />
                  {Number(item.rating || item.avgRating || 3.5).toFixed(1)} / 5.0
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BarChart: Average Rating by Food */}
      <div className="card space-y-4 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-display text-ink-primary">Overall Dish Ratings Overview</h3>
          <span className="text-xs text-ink-muted">Scale 1.0 to 5.0</span>
        </div>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={mockFoodRatings} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2DFD7" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5C5A54" }} interval={0} angle={-15} textAnchor="end" />
              <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: "#5C5A54" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1C1B19", borderRadius: "12px", border: "none", color: "#fff" }}
                itemStyle={{ color: "#F8F7F4" }}
              />
              <Bar dataKey="avgRating" radius={[6, 6, 0, 0]}>
                {mockFoodRatings.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.avgRating >= 4.2 ? "#0D7A5F" : entry.avgRating >= 3.8 ? "#D85A30" : "#B91C1C"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BarChart: Complaints by Category */}
      <div className="card space-y-4 bg-white">
        <h3 className="text-base font-bold font-display text-ink-primary">Complaints Distribution by Category</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={complaintsByCategory} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2DFD7" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#5C5A54" }} />
              <YAxis type="category" dataKey="category" width={110} tick={{ fontSize: 11, fill: "#5C5A54" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1C1B19", borderRadius: "12px", border: "none", color: "#fff" }}
              />
              <Bar dataKey="count" fill="#0D7A5F" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
