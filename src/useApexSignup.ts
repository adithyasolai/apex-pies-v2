import { FormEventHandler, useRef, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { User } from "firebase/auth";

export interface ApexSignupLogicalFields {
  emailRef: React.RefObject<HTMLInputElement | null>;
  passwordRef: React.RefObject<HTMLInputElement | null>;
  passwordConfirmRef: React.RefObject<HTMLInputElement | null>;
  currentUser: User;
  error: string;
  handleSubmit: FormEventHandler<HTMLFormElement>;
}

export const useApexSignup = (): ApexSignupLogicalFields => {
  const emailRef: React.RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
  const passwordRef: React.RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
  const passwordConfirmRef: React.RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

  // default is "" so that we don't have an error by default
  const [error, setError] = useState<string>("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false); // just keeping for future if needed.

  // TODO: Set types for auth custom hook values like `login`
  // after migrating AuthContext.js to TypeScript.
  const { signup, currentUser } = useAuth();

  const navigate: NavigateFunction = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRef.current || !passwordRef.current || !passwordConfirmRef.current) {
      setError("Email or password input is missing.");
      return;
    }

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      console.log("Passwords do not match.");
      return setError("Passwords do not match.");
    }

    // username/password sign-up is async b/c we are communicating with Firebase DB
    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      // re-direct to user profile after signin up
      navigate("/profile");
    } catch (e) {
      // TODO: cast error as a FirebaseError object and parse error message cleanly without revealing
      // that a Firebase database is being used under the hood.
      setError("Failed to create an account. " + e.message);
    }

    setLoading(false);
  }

  return {
    emailRef,
    passwordRef,
    passwordConfirmRef,
    currentUser,
    error,
    handleSubmit
  }

}