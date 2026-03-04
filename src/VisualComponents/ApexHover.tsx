import React from "react";

interface ApexHoverProps {
  hoverText: string;
  children: React.ReactElement;
}

export const ApexHover: React.FC<ApexHoverProps> = ({
  hoverText,
  children,
}) => {
  return (
    <div className="relative inline-block group">
      {children}
      <div
        className="
          absolute left-full top-1/2 -translate-y-1/2 ml-2
          px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap
          invisible group-hover:visible opacity-0 group-hover:opacity-100
          transition-opacity duration-150 z-50 pointer-events-none
          max-sm:left-auto max-sm:top-auto max-sm:translate-y-0
          max-sm:bottom-full max-sm:mb-2
        "
      >
        {hoverText}
      </div>
    </div>
  );
};
