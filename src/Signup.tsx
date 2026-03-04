import React from "react";
import clsx from "clsx";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { CenteredDiv } from "./VisualComponents/ApexCenteredDiv";
import { ApexSignupLogicalFields, useApexSignup } from "./useApexSignup";

export const Signup = () => {
  const {
    emailRef,
    passwordRef,
    passwordConfirmRef,
    currentUser,
    error,
    handleSubmit,
  }: ApexSignupLogicalFields = useApexSignup();

  return (
    <div className="w-full min-h-screen bg-cream text-center pt-navbar">
      <div className="pt-4">
        {/* If there is a currentUser logged in, show their email */}
        {currentUser && (
          <p className="mb-2">
            Current User: {JSON.stringify(currentUser["email"])}
          </p>
        )}

        {/* Error alert */}
        {error && (
          <CenteredDiv>
            <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 rounded px-3 py-2 mb-2">
              <AlertCircle size={16} className="shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          </CenteredDiv>
        )}

        <form onSubmit={handleSubmit}>
          <CenteredDiv>
            <div id="email">
              <label className="block text-left text-sm font-medium mb-1">
                Email
              </label>
              <input
                className={clsx(
                  "w-full border border-gray-800 rounded px-3 py-2 bg-cream",
                  "focus:outline-none focus:ring-2 focus:ring-sky"
                )}
                type="email"
                ref={emailRef}
                required
              />
            </div>
          </CenteredDiv>

          <CenteredDiv>
            <div id="password" className="my-2">
              <label className="block text-left text-sm font-medium mb-1">
                Password
              </label>
              <input
                className={clsx(
                  "w-full border border-gray-800 rounded px-3 py-2 bg-cream",
                  "focus:outline-none focus:ring-2 focus:ring-sky"
                )}
                type="password"
                ref={passwordRef}
                required
              />
            </div>
          </CenteredDiv>

          <CenteredDiv>
            <div id="password-confirm" className="my-2">
              <label className="block text-left text-sm font-medium mb-1">
                Password Confirmation
              </label>
              <input
                className={clsx(
                  "w-full border border-gray-800 rounded px-3 py-2 bg-cream",
                  "focus:outline-none focus:ring-2 focus:ring-sky"
                )}
                type="password"
                ref={passwordConfirmRef}
                required
              />
            </div>
          </CenteredDiv>

          <button
            type="submit"
            className="my-2 bg-sky text-white px-8 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        <div className="my-2">
          Already have an account?{" "}
          <Link to="/login" className="text-sky underline">
            Log In.
          </Link>
        </div>
      </div>
    </div>
  );
};
