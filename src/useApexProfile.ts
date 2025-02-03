import { MouseEventHandler, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { User } from "firebase/auth";

// TODO: Give this a better name
export interface ApexProfileLogicalFields {
  currentUser: User;
  error: string;
  handleSignOut: MouseEventHandler<HTMLButtonElement>;
}

export const useApexProfile = (): ApexProfileLogicalFields => {
  // TODO: Set types for auth custom hook values like `currentUser` and `signout`
  // after migrating AuthContext.js to TypeScript.
  const { currentUser, signout } = useAuth();
  const [error, setError] = useState<string>("");
  const navigate: NavigateFunction = useNavigate();

  const handleSignOut: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    setError("");

    // username/password sign-up is async b/c we are communicating with Firebase DB
    try {
      await signout();
      // re-direct to log-in after sign-out
      navigate("/login");
    } catch (err) {
      console.log(err);
      setError("Failed to sign out.");
    }
  };

  return {
    currentUser,
    error,
    handleSignOut,
  };
};
