import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function ProtectedRoute() {

  const { token } = useAuthStore();

  console.log("Valor del token en ProtectedRoute:", token); // <-- Revisa la consola

  if (!token || token === "" || token === null) {
    return <Navigate to="/login" replace />; 
  }

  return <Outlet />;
}