import React from "react";
import { Navigate, Outlet } from "react-router-dom";
// import { useAppSelector } from "../hook";
// import { RootState } from "../store";

const ProtectedRoutes: React.FC = () => {
  const auth={'token':true}
  
return (auth.token ? <Outlet/> : <Navigate to="/login"/>) ;
};

export default ProtectedRoutes;
