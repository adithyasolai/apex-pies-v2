import React from "react";

interface ApexSectorDisplayProps {
  image: string;
}

export const ApexSectorDisplay: React.FC<ApexSectorDisplayProps> = ({
  image,
}) => {
  return (
    <div className="flex justify-center">
      <img
        src={image}
        alt="Sector Image"
        className="rounded-[10%] border-[5px] border-[#95bfd0ff] w-[50%] max-sm:w-1/2 max-w-full"
      />
    </div>
  );
};
