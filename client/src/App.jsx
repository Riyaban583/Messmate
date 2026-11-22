import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import WeeklyMenu from "./pages/WeeklyMenu";
import Feedback from "./pages/Feedback";
import Complaints from "./pages/Complaints";
import Suggestions from "./pages/Suggestions";

import AdminDashboard from "./admin/AdminDashboard";
import ManageMenu from "./admin/ManageMenu";
import ManageComplaints from "./admin/ManageComplaints";
import ManageSuggestions from "./admin/ManageSuggestions";
import Analytics from "./admin/Analytics";

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-surface-page font-sans text-ink-primary">
      {user && <Navbar />}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student routes */}
          <Route path="/" element={<ProtectedRoute role="student"><Dashboard /></ProtectedRoute>} />
          <Route path="/menu" element={<ProtectedRoute role="student"><Menu /></ProtectedRoute>} />
          <Route path="/weekly-menu" element={<ProtectedRoute role="student"><WeeklyMenu /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute role="student"><Feedback /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute role="student"><Complaints /></ProtectedRoute>} />
          <Route path="/suggestions" element={<ProtectedRoute role="student"><Suggestions /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/menu" element={<ProtectedRoute role="admin"><ManageMenu /></ProtectedRoute>} />
          <Route path="/admin/complaints" element={<ProtectedRoute role="admin"><ManageComplaints /></ProtectedRoute>} />
          <Route path="/admin/suggestions" element={<ProtectedRoute role="admin"><ManageSuggestions /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><Analytics /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
