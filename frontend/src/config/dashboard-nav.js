import { Home, Dumbbell, Utensils, PieChart, Target, User } from "lucide-react";

export const NAV_SECTIONS = [
  { name: "Home", path: "/app", icon: Home, exact: true },
  { name: "Workout Management", path: "/app/workouts", icon: Dumbbell },
  { name: "Macro Tracking", path: "/app/nutrition", icon: Utensils },
  { name: "Insights and Progress", path: "/app/insights", icon: PieChart },
  { name: "Goal Tracking", path: "/app/goals", icon: Target },
  { name: "Profile", path: "/app/profile", icon: User },
];

// Since NAV_SECTIONS_MAIN is already flat:
export const ALL_ROUTES = NAV_SECTIONS;

/** Returns the best-matching title for a pathname (handles nested routes) */
export function getTitleFromPath(pathname) {
  // normalize (remove trailing slash except root)
  const p =
    pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  // 1) exact match
  const exact = ALL_ROUTES.find((r) => r.path === p);
  if (exact) return exact.name;

  // 2) longest prefix match (for nested routes)
  const best = ALL_ROUTES.filter((r) => p.startsWith(r.path)).sort(
    (a, b) => b.path.length - a.path.length
  )[0];

  return best?.name || "Dashboard";
}
