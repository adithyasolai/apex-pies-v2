import React from "react";

import Plot from "react-plotly.js";
import { Button, Card, Container } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
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
    <Container
      fluid
      className="text-center bg-primary vh-100 navbar-padding-top-extra"
    >
      {loading ? (
        <p> loading ... </p>
      ) : (
        <CenteredDivResponsive
          rowClassName="bg-primary"
          leftColClassName="bg-primary"
          rightColClassName="bg-primary"
        >
          <Plot
            data={plotConfig["data"]}
            layout={plotConfig["layout"]}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </CenteredDivResponsive>
      )}

      <CenteredDiv rowClassName="bg-primary">
        <OverlayTrigger
          placement="right"
          overlay={
            <Tooltip>
              {/* This hover will only show if saveAllowed=false */}
              {saveDone ? "Already saved!" : "Log In to save pies!"}
            </Tooltip>
          }
          trigger={saveAllowed ? [] : ["focus", "hover"]}
        >
          <div style={{ display: "inline-block" }} className="bg-primary">
            <Button
              type="submit"
              variant="secondary"
              disabled={saveAllowed ? false : true}
              onClick={handleSaveToProfile}
              style={{
                opacity: saveAllowed ? 1 : 0.5,
                cursor: saveAllowed ? "pointer" : "not-allowed",
              }}
            >
              Save To Profile
            </Button>
          </div>
        </OverlayTrigger>

        <p className="bg-primary"> {saveInProgress ? "saving..." : ""} </p>

        {/* Display fields chosen by user in User Form */}
        <p className="display-6 fs-4">
          Age: {age}
          <br />
          Risk: {risk}
          <br />
          Sector: {sector}
        </p>
      </CenteredDiv>

      {/* AI Stock Recommendations Section */}
      <CenteredDiv rowClassName="bg-primary">
        <Card className="mb-4" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Card.Body>
            <Card.Title className="text-start mb-3">
              AI Stock Recommendations
            </Card.Title>
            {llmSuggestions ? (
              <Card.Text className="text-start">{llmSuggestions}</Card.Text>
            ) : (
              <Card.Text className="text-start text-muted">
                AI recommendations could not be generated at this time. Please
                try again later.
              </Card.Text>
            )}
          </Card.Body>
        </Card>
      </CenteredDiv>

      <ApexPieTable tableRows={tableRows} />
    </Container>
  );
};
