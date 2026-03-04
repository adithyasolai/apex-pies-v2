import React from "react";
import clsx from "clsx";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ApexLoginLogicalFields, useApexLogin } from "./useApexLogin";
import { CenteredDiv } from "./VisualComponents/ApexCenteredDiv";

export const Login = () => {
  const { emailRef, passwordRef, error, handleSubmit }: ApexLoginLogicalFields =
    useApexLogin();

  return (
    <div className="w-full min-h-screen bg-cream text-center pt-navbar">
      <div className="pt-4">
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
            <div id="password" className="mt-4">
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
            <button
              type="submit"
              className="w-full mt-4 bg-sky text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Log In
            </button>
          </CenteredDiv>
        </form>

        <div className="mt-3">
          Need an account?{" "}
          <Link to="/signup" className="text-sky underline">
            Sign Up.
          </Link>
        </div>
      </div>
    </div>
  );
};
