import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { isSchoolEmail } from "../utils/validateEmail";
import { UtensilsCrossed, Eye, EyeOff, ShieldCheck, UserCheck, Loader2 } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!isSchoolEmail(email)) {
      setError("Please use an official institutional email (e.g. student@hostel.edu, name@iitb.ac.in).");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const user = await login({ email, password, role });
      if (user) {
        toast.success(`Welcome back, ${user.name || "User"}!`);
        navigate(user.role === "admin" ? "/admin" : "/");
      }
    } catch (err) {
      const msg = err.message || "Failed to log in. Please check your credentials.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 animate-fade-in">
      <div className="card w-full max-w-md space-y-6 shadow-xl border-border/80 bg-white/95">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 items-center justify-center text-white shadow-lg shadow-primary-500/30 mb-1">
            <UtensilsCrossed size={24} />
          </div>
          <h1 className="text-2xl font-bold font-display text-ink-primary">Log in to MessMate</h1>
          <p className="text-sm text-ink-secondary">Hostel Mess Menu, Ratings & Feedback Portal</p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex bg-surface-muted p-1 rounded-2xl border border-border/70">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer ${
              role === "student"
                ? "bg-white text-primary shadow-xs border border-border/50"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            <UserCheck size={16} />
            <span>Student Portal</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer ${
              role === "admin"
                ? "bg-white text-secondary shadow-xs border border-border/50"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            <ShieldCheck size={16} />
            <span>Admin Hub</span>
          </button>
        </div>

        {/* Google OAuth Option */}
        <div className="space-y-3">
          <GoogleSignInButton
            role={role}
            onSuccess={() => {
              toast.success("Signed in with Google successfully!");
              navigate(role === "admin" ? "/admin" : "/");
            }}
            onError={(msg) => {
              setError(msg);
              toast.error(msg);
            }}
          />

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-border/80 w-full"></div>
            <span className="bg-white px-3 text-xs font-semibold text-ink-muted uppercase tracking-wider absolute">OR</span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1.5" htmlFor="email">
              Institutional Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-muted/40 border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder={role === "admin" ? "admin@hostel.edu" : "student@hostel.edu"}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-ink-secondary" htmlFor="password">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-muted/40 border border-border rounded-xl px-3.5 py-2.5 pr-10 text-sm text-ink-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-500/20 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary p-1 cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium p-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-xl font-semibold shadow-md shadow-primary-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Log in to {role === "admin" ? "Admin Hub" : "Student Portal"}</span>
            )}
          </button>
        </form>

        <p className="text-xs text-ink-secondary text-center pt-2">
          New hostel student?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
