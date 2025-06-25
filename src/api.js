import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";

const toast = useToast();

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Your API base URL
  timeout: 10000, // 15 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();

    // Add authorization token if available
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }

    // You can add other headers or modify config here
    config.headers["Content-Type"] = "application/json";
    config.headers["Accept"] = "application/json";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response.data;
  },
  (error) => {
    const authStore = useAuthStore();

    // Handle errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - logout user
          toast.error("Session expired. Please login again.");
          authStore.logout();
          window.location.href = "/login";
          break;

        case 403:
          // Forbidden
          //toast.error('You do not have permission to access this resource.');
          console.log("You do not have permission to access this resource.");
          break;

        case 404:
          // Not found
          toast.error("Resource not found.");
          break;

        case 500:
          // Server error
          toast.error("Server error occurred. Please try again later.");
          break;

        default:
          // Other errors
          toast.error(error.response.data?.message || "An error occurred");
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error("Network error. Please check your connection.");
    } else {
      // Something happened in setting up the request
      toast.error("Request error. Please try again.");
    }

    return Promise.reject(error);
  },
);

export default api;
