import React from "react";
import { CenteredDiv } from "./ApexCenteredDiv";

export interface ApexPieInputDisplayProps {
  age: number;
  risk: number;
  sector: string;
}

export const ApexPieInputDisplay: React.FC<ApexPieInputDisplayProps> = ({
  age,
  risk,
  sector,
}) => {
  return (
    <CenteredDiv rowClassName="bg-primary text-center">
      {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
      {/* Display fields chosen by user in User Form */}
      <p className="display-6 fs-4">
        Age: {age}
        <br />
        Risk: {risk}
        <br />
        Sector: {sector}
      </p>
    </CenteredDiv>
  );
};
