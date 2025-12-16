import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Moon, Sun, Menu } from "lucide-react";
import { format } from "date-fns";
import { getTitleFromPath } from "../../config/dashboard-nav";

const THEME_KEY = "novafit-theme";

// map route → title
const PAGE_TITLES = {
  "/app": "Home",
  "/app/workouts": "Workout Management",
  "/app/nutrition": "Macro Tracking",
  "/app/insights": "Insights and Progress",
  "/app/goals": "Goal Tracking",
  "/app/profile": "Profile",
};

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export default function Topbar({ onOpenMenu }) {
  const [theme, setTheme] = useState("light");
  const [today, setToday] = useState("");
  const { pathname } = useLocation();
  const pageTitle = getTitleFromPath(pathname);

  // Format current date
  useEffect(() => {
    setToday(format(new Date(), "EEEE, MMM d")); // Monday, Aug 25
  }, []);

  // Initialize theme
  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
      return;
    }
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = prefersDark ? "dark" : "light";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mql) return;

    const handleChange = (e) => {
      if (localStorage.getItem(THEME_KEY)) return;
      const next = e.matches ? "dark" : "light";
      setTheme(next);
      applyTheme(next);
    };

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  };

  return (
    <div className="bg-base border-b border-subtle px-5 md:px-8 py-4 flex flex-row justify-between items-center">
      <div className="flex items-center gap-3">
        {/* Hamburger visible only on small screens */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="md:hidden p-2 rounded-lg hover:bg-subtle"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6 text-primary" />
        </button>
        <h6 className="text-primary">{pageTitle}</h6>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray transition"
          aria-label="Toggle dark mode"
          type="button"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-primary" />
          ) : (
            <Moon className="w-5 h-5 text-primary" />
          )}
        </button>
        <p className="p2 text-secondary hidden md:block">{today}</p>
      </div>
    </div>
  );
}
