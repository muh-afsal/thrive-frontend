// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { selectAuthState } from '../redux/reducers/authSlice';

// interface RoleBasedRouteProps {
//   element: React.ReactNode;
//   path: string;
//   allowedRoles: string[];
// }

// const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ element, path, allowedRoles }) => {
//   const { isAuthenticated, user } = useSelector(selectAuthState);

//   const hasRequiredRole = user && allowedRoles.includes(user.role);

//   return (
//     <Route
//       path={path}
//       element={isAuthenticated && hasRequiredRole ? element : <Navigate to="/unauthorized" />}
//     />
//   );
// };

// export default RoleBasedRoute;
