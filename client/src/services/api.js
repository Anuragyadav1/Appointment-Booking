import axios from "axios";

// Create axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  login: (credentials) => api.post("/login", credentials),
  register: (userData) => api.post("/register", userData),
};

export const slotsAPI = {
  getSlots: (from, to) => {
    if (!from || !to) {
      return Promise.reject(new Error("Both from and to dates are required"));
    }
    return api.get(`/slots?from=${from}&to=${to}`);
  },
};

export const bookingsAPI = {
  bookSlot: (bookingData) => api.post("/book", bookingData),
  getMyBookings: () => api.get("/my-bookings"),
  getAllBookings: (page = 1, limit = 20, status) => {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append("status", status);
    return api.get(`/all-bookings?${params}`);
  },
  updateStatus: (bookingId, status) =>
    api.patch(`/bookings/${bookingId}/status`, { status }),
};

export default api;
