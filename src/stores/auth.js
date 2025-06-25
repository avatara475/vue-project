import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("authToken") || null,
    role: localStorage.getItem("userRole") || null,
    userId: localStorage.getItem("userId") || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.role,
  },
  actions: {
    login(payload) {
      // Your login API call
      this.token = payload.token;
      this.role = payload.user.role;
      this.userId = payload.user.id;

      // Update localStorage
      localStorage.setItem("authToken", payload.token);
      localStorage.setItem("userRole", payload.user.role);
      localStorage.setItem("userId", payload.user.id);
    },
    logout() {
      this.token = null;
      this.role = null;
      this.userId = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
    },
    setRole(role) {
      this.role = role;
      localStorage.setItem("userRole", role);

      // // Force logout if role was changed by SuperAdmin
      // if (role !== this.role && !window.location.pathname.includes('login')) {
      //   this.logout(); // Triggers logout + clears storage
      // }
    },
  },
});
