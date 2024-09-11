import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { decodeAccessToken } from "../utils/jwt/jwtService"; // Assuming your decodeAccessToken function is in this file

const ProtectedRoutes: React.FC = () => {
  const token = decodeAccessToken(); 

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
