import React from "react";
import clsx from "clsx";
import { AlertCircle, LogOut } from "lucide-react";
import { ApexProfileLogicalFields, useApexProfile } from "./useApexProfile";

export const Profile: React.FC = () => {
  const { currentUser, error, handleSignOut }: ApexProfileLogicalFields =
    useApexProfile();

  return (
    <div className="w-full min-h-screen bg-cream text-center pt-navbar">
      <div className="pt-4">
        {currentUser && (
          <h3 className="text-xl font-semibold mb-4">{currentUser["email"]}</h3>
        )}

        {error && (
          <div className="flex items-center justify-center gap-2 bg-red-50 border border-red-300 text-red-700 rounded px-3 py-2 mb-4 max-w-sm mx-auto">
            <AlertCircle size={16} className="shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          onClick={handleSignOut}
          className={clsx(
            "flex items-center gap-2 mx-auto bg-sky text-white px-6 py-2 rounded-lg font-semibold",
            "hover:opacity-90 transition-opacity cursor-pointer"
          )}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
};
