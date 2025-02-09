import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

interface PublicOnlyRouteProps {
  children: React.ReactElement;
}

// Makes sure that the page can only be accessed if the user is not currently logged in.
export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  // TODO: After migrating AuthContext.js to tsx, add typing to this `currentUser` variable.
  const { currentUser } = useAuth();

  return currentUser ? <Navigate to="login" replace /> : children;
};
