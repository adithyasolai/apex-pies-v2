import React from "react";
import { Location, Navigate, useLocation } from "react-router-dom";

interface FormRouteProps {
  children: React.ReactElement;
}

interface LocationState {
  cameFromUserForm?: boolean;
}

// Makes sure that the page can only be accessed if the user was redirected from the UserForm.
const FormRouteOnly: React.FC<FormRouteProps> = ({ children }) => {
  const location: Location = useLocation();
  const state = location.state as LocationState;
  const cameFromUserForm: boolean = state?.cameFromUserForm ?? false;

  return cameFromUserForm ? children : <Navigate to="/" replace />;
};

export default FormRouteOnly;
