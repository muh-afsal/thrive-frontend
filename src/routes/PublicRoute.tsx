import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hook";
import { RootState } from "../store";

interface PublicRouteProps {
  restricted?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ restricted = false }) => {
  const { email } = useAppSelector((state: RootState) => state.auth);

  if (email && restricted) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
