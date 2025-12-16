import { Routes, Route } from "react-router-dom";

// Public pages
import Landing from "./pages/public/Landing";
// import Features from "./pages/public/Features";
// import About from "./pages/public/About";
// import Contact from "./pages/public/Contact";
// import Register from "./pages/public/Register";
import Login from "./pages/public/auth/Login";
import CreateProfile from "./pages/public/auth/CreateProfile";
import CreateAccount from "./pages/public/auth/CreateAccount";
import Privacy from "./pages/public/Privacy";
import Terms from "./pages/public/Terms";
import Maintenance from "./pages/public/Maintenance";
import NotFound from "./pages/public/NotFound";

// App pages
import Dashboard from "./pages/app/Dashboard";
// import Workouts from "./pages/app/workouts/Workouts";
import WorkoutsRoutes from "./pages/app/workouts/WorkoutsRoutes";
import NutritionRoutes from "./pages/app/nutrition/NutritionRoutes";
import Insights from "./pages/app/Insights";
import GoalRoutes from "./pages/app/goal/GoalRoutes";
import Profile from "./pages/app/Profile";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/create-profile" element={<CreateProfile />} />
      <Route path="/auth/create-account" element={<CreateAccount />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/maintenance" element={<Maintenance />} />

      {/* Protected App Routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/workouts/*"
        element={
          <ProtectedRoute>
            <WorkoutsRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/nutrition/*"
        element={
          <ProtectedRoute>
            <NutritionRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/insights"
        element={
          <ProtectedRoute>
            <Insights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/goals/*"
        element={
          <ProtectedRoute>
            <GoalRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
