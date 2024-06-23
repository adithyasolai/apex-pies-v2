import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Makes sure that the page can only be accessed if the user is not currently logged in.
export default function PublicOnlyRoute({ children, ...rest }) {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={() => {
        return currentUser ? <Redirect to="/" /> : children;
      }}
    />
  );
}
