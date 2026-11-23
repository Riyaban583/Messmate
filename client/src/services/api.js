import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? "https://messmate-1-b4ra.onrender.com/api"
    : "http://localhost:5000/api");

const api = axios.create({
  baseURL,
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("messmate_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize errors to the { success, message } shape used across the app.
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || "Something went wrong. Please try again.";
    return Promise.reject({ success: false, message, status: err.response?.status });
  }
);

export const authApi = {
  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

export const menuApi = {
  today: () => api.get("/menu/today"),
  list: (params) => api.get("/menu", { params }),
  create: (payload) => api.post("/menu", payload),
  update: (id, payload) => api.put(`/menu/${id}`, payload),
  remove: (id) => api.delete(`/menu/${id}`),
};

export const feedbackApi = {
  submit: (payload) => api.post("/feedback", payload),
  mine: () => api.get("/feedback/my"),
  adminList: (params) => api.get("/admin/feedback", { params }),
  adminAnalytics: () => api.get("/admin/feedback/analytics"),
};

export const complaintsApi = {
  submit: (payload) => api.post("/complaints", payload),
  mine: () => api.get("/complaints/my"),
  adminList: (params) => api.get("/admin/complaints", { params }),
  updateStatus: (id, payload) => api.put(`/admin/complaints/${id}/status`, payload),
};

export const suggestionsApi = {
  list: () => api.get("/suggestions"),
  submit: (payload) => api.post("/suggestions", payload),
  vote: (id) => api.post(`/suggestions/${id}/vote`),
  adminUpdate: (id, payload) => api.put(`/admin/suggestions/${id}`, payload),
  adminRemove: (id) => api.delete(`/admin/suggestions/${id}`),
};

export const analyticsApi = {
  summary: () => api.get("/admin/analytics"),
};

export default api;
