import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import React from "react";

interface AuthStore {
  user: any;
}

const ProtectedRoutes = () => {
  const { user } = useAuthStore() as AuthStore;

  return user ? <Outlet /> : <Navigate to='/' replace={true} />;
};

export default ProtectedRoutes;
