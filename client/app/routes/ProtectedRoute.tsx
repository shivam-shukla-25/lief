import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) {
    console.warn("ProtectedRoute: No user found. Token:", token);
  }
  return user ? children : <Navigate to="/login" />;
};
