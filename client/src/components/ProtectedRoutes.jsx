import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const ProtectedRoutes = () => {
  const { user } = useAuthStore();

  return <>{user ? <Outlet /> : <Navigate to='/' replace={true} />}</>;
};

export default ProtectedRoutes;
