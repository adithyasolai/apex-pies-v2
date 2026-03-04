import React from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PiePlot } from "./PiePlot";
import { ApexMyPiesLogicalFields, useApexMyPies } from "./useApexMyPies";
import { ApexPieTable } from "./VisualComponents/ApexPieTable";
import { ApexPieInputDisplay } from "./VisualComponents/ApexPieInputDisplay";
import { CenteredDivResponsive } from "./VisualComponents/ApexCenteredDiv";

interface ApexPiesCarouselProps {
  numSaved: number;
  activePie: number;
  handleSelect: (selectedIndex: number, e: any) => void;
}

const ApexPiesCarousel: React.FC<ApexPiesCarouselProps> = ({
  numSaved,
  activePie,
  handleSelect,
}) => {
  const total = Math.min(numSaved, 4);
  const prev = () => handleSelect(activePie > 0 ? activePie - 1 : total - 1, null);
  const next = () => handleSelect(activePie < total - 1 ? activePie + 1 : 0, null);

  return (
    <div className="relative">
      {/* Slide strip */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activePie * 100}%)` }}
        >
          {Array.from(Array(total), (_, i) => i).map((i) => (
            <div key={i} className="min-w-full">
              <div className="w-full md:w-5/6 mx-auto">
                {/* The `numSaved-i` allows the most recent 4 pies to be shown */}
                {/* It works because the PieNums in the backend start at 1, not 0. */}
                <PiePlot pieNum={numSaved - i} active={activePie === i} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Left arrow */}
      <button
        onClick={prev}
        aria-label="Previous pie"
        className="absolute left-0 top-1/2 -translate-y-1/2 p-1 text-gray-800 hover:text-sky transition-colors"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        aria-label="Next pie"
        className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-gray-800 hover:text-sky transition-colors"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
};

export const MyPies = () => {
  const {
    numSaved,
    activePie,
    age,
    risk,
    sector,
    tableRows,
    handleSelect,
  }: ApexMyPiesLogicalFields = useApexMyPies();

  return (
    <>
      {numSaved === null || numSaved === 0 ? (
        <div className="w-full min-h-screen bg-cream text-center pt-navbar-extra">
          <div className="w-1/2 mx-auto">
            <p className="text-4xl lg:text-5xl text-black w-full">
              {numSaved === null ? "loading..." : "No pies to display."}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full min-h-screen bg-cream text-center pt-navbar-extra">
          <CenteredDivResponsive>
            {numSaved === 1 ? (
              <PiePlot pieNum={numSaved} active={true} />
            ) : (
              <ApexPiesCarousel
                numSaved={numSaved}
                activePie={activePie}
                handleSelect={handleSelect}
              />
            )}
          </CenteredDivResponsive>

          {numSaved > 1 && (
            <div className="bg-cream text-center">
              <p>{activePie + 1}</p>
            </div>
          )}

          <ApexPieInputDisplay age={age} risk={risk} sector={sector} />
          <ApexPieTable tableRows={tableRows} />
        </div>
      )}
    </>
  );
};
