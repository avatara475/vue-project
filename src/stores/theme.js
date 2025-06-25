import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(localStorage.getItem("darkMode") === "true" || false);

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    applyTheme();
  };

  const applyTheme = () => {
    localStorage.setItem("darkMode", isDark.value);
    if (isDark.value) {
      document.documentElement.classList.add("dark-mode");
      document.documentElement.classList.remove("light-mode");
    } else {
      document.documentElement.classList.add("light-mode");
      document.documentElement.classList.remove("dark-mode");
    }
  };

  // Initialize theme on load
  applyTheme();

  return { isDark, toggleTheme };
});
