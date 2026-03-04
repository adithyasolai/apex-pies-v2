import React from "react";
import { BookOpen, LogOut, PieChart, User } from "lucide-react";
import arrows from "./resources/ArrowsNoBckgd.png";
import { useAuth } from "./contexts/AuthContext";

export const ApexNavBar: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <nav
      id="mainNav"
      className="fixed top-0 left-0 right-0 z-50 h-navbar bg-gradient-navbar shadow-sm"
    >
      <div className="h-full flex items-center px-5">
        {/* Logo + Brand */}
        <a href="/" className="flex items-center gap-1 no-underline">
          <img
            src={arrows}
            alt="Apex Pies logo"
            className="h-7 pb-1"
          />
          <span className="font-kanit font-semibold text-lg text-gray-900 hover:text-sky transition-colors">
            Apex Pies
          </span>
        </a>

        {/* Nav links */}
        <div className="ml-auto hidden lg:flex items-center gap-6">
          {currentUser && (
            <a
              href="/mypies"
              className="flex items-center gap-1 text-gray-900 hover:text-sky transition-colors no-underline"
            >
              <PieChart size={16} />
              My Pies
            </a>
          )}
          {currentUser ? (
            <a
              href="/profile"
              className="flex items-center gap-1 text-gray-900 hover:text-sky transition-colors no-underline"
            >
              <User size={16} />
              Profile
            </a>
          ) : (
            <a
              href="/login"
              className="flex items-center gap-1 text-gray-900 hover:text-sky transition-colors no-underline"
            >
              <LogOut size={16} />
              Log In
            </a>
          )}
          <a
            href="/resourcesfaq"
            className="flex items-center gap-1 text-gray-900 hover:text-sky transition-colors no-underline"
          >
            <BookOpen size={16} />
            Resources and FAQ
          </a>
        </div>
      </div>
    </nav>
  );
};
