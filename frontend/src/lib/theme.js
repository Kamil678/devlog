import { useSyncExternalStore } from "react";

const listeners = new Set();

const getTheme = () => (document.documentElement.classList.contains("dark") ? "dark" : "light");

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const setTheme = (theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch (err) {
    console.warn(err);
  }
  listeners.forEach((listener) => listener());
};

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return { theme, toggleTheme };
}
