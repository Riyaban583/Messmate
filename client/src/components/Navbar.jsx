import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { 
  UtensilsCrossed, 
  CalendarDays, 
  Star, 
  AlertCircle, 
  Lightbulb, 
  LayoutDashboard, 
  LogOut,
  Sparkles,
  ShieldCheck
} from "lucide-react";

const studentLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/menu", label: "Today's Menu", icon: UtensilsCrossed },
  { to: "/weekly-menu", label: "Weekly Menu", icon: CalendarDays },
  { to: "/feedback", label: "Rate & Feedback", icon: Star },
  { to: "/complaints", label: "Complaints", icon: AlertCircle },
  { to: "/suggestions", label: "Suggestions", icon: Lightbulb },
];

const adminLinks = [
  { to: "/admin", label: "Admin Hub", icon: LayoutDashboard },
  { to: "/admin/menu", label: "Manage Menu", icon: CalendarDays },
  { to: "/admin/complaints", label: "Complaints", icon: AlertCircle },
  { to: "/admin/suggestions", label: "Suggestions", icon: Lightbulb },
  { to: "/admin/analytics", label: "Analytics", icon: Sparkles },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === "admin" ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-border/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-500/25">
            <UtensilsCrossed size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-xl text-ink-primary tracking-tight">MessMate</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-primary-50 text-primary border border-primary-100">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-ink-muted leading-none hidden sm:block">Campus Dining Portal</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-surface-muted/60 p-1.5 rounded-2xl border border-border/60">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/" || link.to === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-body-sm font-semibold px-3.5 py-2 rounded-xl transition-all duration-150 ${
                    isActive
                      ? "bg-white text-primary shadow-xs border border-border/50"
                      : "text-ink-secondary hover:text-ink-primary hover:bg-white/50"
                  }`
                }
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile & Action */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-muted/50 border border-border/50">
            <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary flex items-center justify-center text-xs font-bold">
              {user?.name ? user.name[0].toUpperCase() : "S"}
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-ink-primary truncate max-w-[110px]">{user?.name || "Student"}</p>
              <p className="text-[10px] text-ink-muted capitalize flex items-center gap-1">
                {user?.role === "admin" && <ShieldCheck size={10} className="text-secondary" />}
                {user?.role || "Student"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-body-sm font-medium text-ink-secondary hover:text-danger px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Exit</span>
          </button>
        </div>
      </div>

      {/* Mobile Bar / Nav Drawer */}
      <nav className="flex lg:hidden overflow-x-auto px-3 py-2 gap-1.5 border-t border-border/60 bg-white scrollbar-none">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/" || link.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "bg-surface-muted text-ink-secondary hover:bg-surface-page"
                }`
              }
            >
              <Icon size={14} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
