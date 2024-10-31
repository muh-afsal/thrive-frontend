import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hook";
import { RootState } from "../redux/store";

interface PublicRouteProps {
  restricted?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ restricted = false }) => {
  const { data } = useAppSelector((state: RootState) => state.user);
  const email=data?.email;

  if (email && restricted) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
