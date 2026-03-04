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
    <CenteredDiv rowClassName="bg-cream text-center">
      {/* Display fields chosen by user in User Form */}
      <p className="text-xl lg:text-2xl">
        Age: {age}
        <br />
        Risk: {risk}
        <br />
        Sector: {sector}
      </p>
    </CenteredDiv>
  );
};
