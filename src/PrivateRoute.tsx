import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

interface PrivateRouteProps {
  children: React.ReactElement;
}

// Makes sure that the page can only be accessed if we are currently logged into a user
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // TODO: After migrating AuthContext.js to tsx, add typing to this `currentUser` variable.
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
