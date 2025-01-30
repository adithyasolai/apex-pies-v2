import React from "react";
import { Redirect, useLocation } from "react-router-dom";
import { Route } from "react-router-dom";

interface FormRouteProps {
  children: React.ReactElement
}

interface LocationState {
  cameFromUserForm?: boolean;
}

// Makes sure that the page can only be accessed if the user was redirected from the UserForm.
const FormRouteOnly: React.FC<FormRouteProps> = ({ children, ...rest }) => {
  const location = useLocation<LocationState>();
  const cameFromUserForm: boolean = location.state?.cameFromUserForm ?? false;

  return (
    <Route
      {...rest}
      render={() => {
        return cameFromUserForm ? children : <Redirect to="/" />;
      }}
    />
  );
}

export default FormRouteOnly;
