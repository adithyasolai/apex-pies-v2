import "./styles.css";
import {
  createBrowserRouter,
  Outlet,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { UserForm } from "./UserForm";
import { PieResults } from "./PieResults";
import { Login } from "./Login";
import { StrictMode } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./PrivateRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { FormRouteOnly } from "./FormRouteOnly";
import { Profile } from "./Profile";
import { ResourcesFaq } from "./ResourcesFaq";
import { Signup } from "./Signup";
import { ApexNavBar } from "./ApexNavBar";
import { MyPies } from "./MyPies";
import React from "react";

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthProvider>
          <ApexNavBar />
          <Outlet />
        </AuthProvider>
      ),
      children: [
        {
          index: true,
          element: <UserForm />,
        },
        {
          path: "pieresults",
          element: (
            <FormRouteOnly>
              <PieResults />
            </FormRouteOnly>
          ),
        },
        {
          path: "login",
          element: (
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          ),
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "mypies",
          element: (
            <PrivateRoute>
              <MyPies />
            </PrivateRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          ),
        },
        {
          path: "resourcesfaq",
          element: <ResourcesFaq />,
        },
        {
          path: "*",
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ]);

  return (
    <React.Fragment>
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    </React.Fragment>
  );
};

export default App;
