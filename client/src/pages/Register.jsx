import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { isSchoolEmail } from "../utils/validateEmail";
import { UtensilsCrossed, Eye, EyeOff, Loader2, Check, ShieldAlert } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", roomNumber: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Password strength logic
  const pass = form.password;
  const isMinLength = pass.length >= 6;
  const hasNumber = /\d/.test(pass);
  const hasLetter = /[a-zA-Z]/.test(pass);
  const strengthScore = [isMinLength, hasNumber, hasLetter].filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Name, email, and password are required.");
      return;
    }
    if (!isSchoolEmail(form.email)) {
      setError("Invalid email format. Only official institutional email addresses (e.g. student@hostel.edu, alex@iitb.ac.in) are permitted.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const user = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: "student",
        roomNumber: form.roomNumber,
      });

      if (user) {
        toast.success("Account created successfully! Welcome to MessMate.");
        navigate("/");
      }
    } catch (err) {
      const msg = err.message || "Failed to create account. Please try again.";
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
          <h1 className="text-2xl font-bold font-display text-ink-primary">Join MessMate</h1>
          <p className="text-sm text-ink-secondary">Student Registration & Dining Feedback Portal</p>
        </div>

        {/* Google Sign In Option */}
        <div className="space-y-3">
          <GoogleSignInButton
            role="student"
            onSuccess={() => {
              toast.success("Signed in with Google successfully!");
              navigate("/");
            }}
            onError={(msg) => {
              setError(msg);
              toast.error(msg);
            }}
          />

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-border/80 w-full"></div>
            <span className="bg-white px-3 text-xs font-semibold text-ink-muted uppercase tracking-wider absolute">OR REGISTER WITH EMAIL</span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={update("name")}
              className="w-full bg-surface-muted/40 border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder="Aarav Sharma"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1.5">
              Institutional Email *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              className="w-full bg-surface-muted/40 border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder="student@hostel.edu"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1.5">
              Hostel Room Number (Optional)
            </label>
            <input
              type="text"
              value={form.roomNumber}
              onChange={update("roomNumber")}
              className="w-full bg-surface-muted/40 border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder="e.g. Block-A Room 302"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1.5">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={update("password")}
                className="w-full bg-surface-muted/40 border border-border rounded-xl px-3.5 py-2.5 pr-10 text-sm text-ink-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-500/20 transition-all"
                placeholder="At least 6 characters"
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

            {/* Password strength meter */}
            {form.password && (
              <div className="mt-2.5 space-y-1.5">
                <div className="flex gap-1 h-1.5 w-full bg-surface-muted rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strengthScore >= 1 ? "bg-rose-500 w-1/3" : "w-0"}`}></div>
                  <div className={`h-full transition-all duration-300 ${strengthScore >= 2 ? "bg-amber-500 w-1/3" : "w-0"}`}></div>
                  <div className={`h-full transition-all duration-300 ${strengthScore >= 3 ? "bg-emerald-500 w-1/3" : "w-0"}`}></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-ink-muted">
                  <span className="flex items-center gap-1">
                    {isMinLength ? <Check size={12} className="text-emerald-600" /> : <ShieldAlert size={12} className="text-rose-500" />}
                    6+ chars
                  </span>
                  <span className="flex items-center gap-1">
                    {hasNumber ? <Check size={12} className="text-emerald-600" /> : null}
                    Includes numbers
                  </span>
                </div>
              </div>
            )}
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
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register Student Account</span>
            )}
          </button>
        </form>

        <p className="text-xs text-ink-secondary text-center pt-2">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
