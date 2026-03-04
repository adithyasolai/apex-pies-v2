import React from "react";
import clsx from "clsx";

interface CenteredDivProps {
  rowClassName?: string;
  leftColClassName?: string;
  rightColClassName?: string;
  children: React.ReactNode;
}

export const CenteredDiv: React.FC<CenteredDivProps> = ({
  rowClassName,
  children,
}) => (
  <div className={clsx("flex justify-center", rowClassName)}>
    <div className="w-full max-w-sm">{children}</div>
  </div>
);

// Responsive to end user's screen size
export const CenteredDivResponsive: React.FC<CenteredDivProps> = ({
  rowClassName,
  children,
}) => (
  <div className={clsx("flex justify-center", rowClassName)}>
    <div className="w-full md:w-1/2">{children}</div>
  </div>
);
