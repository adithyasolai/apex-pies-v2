import React from "react";
import clsx from "clsx";
import Plot from "react-plotly.js";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { ApexPieTable } from "./VisualComponents/ApexPieTable";
import {
  ApexPieResultsLogicalFields,
  useApexPieResults,
} from "./useApexPieResults";
import {
  CenteredDiv,
  CenteredDivResponsive,
} from "./VisualComponents/ApexCenteredDiv";

export const PieResults = () => {
  const {
    age,
    risk,
    sector,
    loading,
    saveAllowed,
    saveInProgress,
    saveDone,
    plotConfig,
    tableRows,
    llmSuggestions,
    handleSaveToProfile,
  }: ApexPieResultsLogicalFields = useApexPieResults();

  return (
    <div className="w-full min-h-screen bg-cream text-center pt-navbar-extra">
      {loading ? (
        <p>loading ...</p>
      ) : (
        <CenteredDivResponsive rowClassName="bg-cream">
          <Plot
            data={plotConfig["data"]}
            layout={plotConfig["layout"]}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </CenteredDivResponsive>
      )}

      <CenteredDiv rowClassName="bg-cream">
        {/* Save button with tooltip when disabled */}
        <div className="relative inline-block group">
          <button
            type="button"
            disabled={!saveAllowed}
            onClick={handleSaveToProfile}
            className={clsx(
              "flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-opacity",
              saveAllowed
                ? "bg-sky text-white hover:opacity-90 cursor-pointer"
                : "bg-sky text-white opacity-50 cursor-not-allowed"
            )}
          >
            {saveDone ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            Save To Profile
          </button>
          {!saveAllowed && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 pointer-events-none">
              {saveDone ? "Already saved!" : "Log In to save pies!"}
            </div>
          )}
        </div>

        <p className="bg-cream min-h-6">
          {saveInProgress ? "saving..." : ""}
        </p>

        {/* Display fields chosen by user in User Form */}
        <p className="text-xl lg:text-2xl">
          Age: {age}
          <br />
          Risk: {risk}
          <br />
          Sector: {sector}
        </p>
      </CenteredDiv>

      {/* AI Stock Recommendations Section */}
      <CenteredDiv rowClassName="bg-cream">
        <div className="rounded-lg border border-gray-200 shadow-sm p-4 mb-4 max-w-2xl mx-auto text-left">
          <h5 className="font-semibold mb-3">AI Stock Recommendations</h5>
          {llmSuggestions ? (
            <p className="text-gray-800 whitespace-pre-wrap">{llmSuggestions}</p>
          ) : (
            <p className="text-gray-500">
              AI recommendations could not be generated at this time. Please
              try again later.
            </p>
          )}
        </div>
      </CenteredDiv>

      <ApexPieTable tableRows={tableRows} />
    </div>
  );
};
