import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface RoleBasedRouteProps {
  allowedRoles: string[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const { data } = useSelector((state: RootState) => state.user);
  console.log(data,'thisi is the data from role based thing');
  

  if (!data || !data.role) {
    return <Navigate to="/login" />;
  }

  const role: string = data.role;

  if (!allowedRoles.includes(role)) {
    toast.error("You are not allowed to access this route!");
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
