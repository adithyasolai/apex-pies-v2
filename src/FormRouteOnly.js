import React from "react";
import { Redirect, useLocation } from "react-router-dom";
import { Route } from "react-router-dom";

// Makes sure that the page can only be accessed if the user was redirected from the UserForm.
export default function FormRouteOnly({ children, ...rest }) {
  const location = useLocation();
  const cameFromUserForm = location.state?.cameFromUserForm

  return (
    <Route
      {...rest}
      render={() => {
        return cameFromUserForm ? children : <Redirect to="/" />;
      }}
    />
  );
}
