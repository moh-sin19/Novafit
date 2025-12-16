import { Navigate, useLocation } from "react-router-dom";
import { getToken, isTokenValid, clearToken } from "../../utils/auth";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = getToken();

  if (!isTokenValid(token)) {
    // Cleanup and bounce to login, preserving where the user was going
    clearToken();
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname, reason: "expired_or_missing_token" }}
      />
    );
  }

  return children;
}
