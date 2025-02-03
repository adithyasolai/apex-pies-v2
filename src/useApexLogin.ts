import { FormEventHandler, useRef, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { NavigateFunction, useNavigate } from "react-router-dom";

// TODO: Give this a better name
export interface ApexLoginLogicalFields {
  emailRef: React.RefObject<HTMLInputElement | null>;
  passwordRef: React.RefObject<HTMLInputElement | null>;
  error: string;
  handleSubmit: FormEventHandler<HTMLFormElement>;
}

export const useApexLogin = (): ApexLoginLogicalFields => {
  const emailRef: React.RefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement>(null);
  const passwordRef: React.RefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement>(null);

  // TODO: Set types for auth custom hook values like `login`
  // after migrating AuthContext.js to TypeScript.
  const { login } = useAuth();

  // default is "" so that we don't have an error by default
  const [error, setError] = useState<string>("");
  const navigate: NavigateFunction = useNavigate();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!emailRef.current || !passwordRef.current) {
      setError("Email or password input is missing.");
      return;
    }

    // username/password sign-up is async b/c we are communicating with Firebase DB
    try {
      setError("");
      await login(emailRef.current.value, passwordRef.current.value);
      // re-direct to main page after logging in
      navigate("/");
    } catch (e) {
      console.log(e);
      setError("Failed to log in to " + emailRef.current.value);
    }
  };

  return {
    emailRef,
    passwordRef,
    error,
    handleSubmit,
  };
};
