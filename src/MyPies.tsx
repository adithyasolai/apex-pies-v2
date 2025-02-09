import React from "react";
import { Carousel, Col, Container, Row } from "react-bootstrap";
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
  return (
    <Carousel
      activeIndex={activePie}
      onSelect={handleSelect}
      data-bs-theme="dark" // makes left/arrows black
      interval={null} // disables auto-play of carousel
      controls={true} // making left/right arrows show up
      fade={false} // use this to toggle slide vs fade animation
      indicators={false} // remove black slide indicators at the bottom
    >
      {Array.from(Array(Math.min(numSaved, 4)), (x, i) => i).map((i) => {
        return (
          <Carousel.Item key={i}>
            <Row>
              <Col />
              <Col xs={12} md={10}>
                {/* The `numSaved-i` allows the most recent 4 pies to be shown */}
                {/* It works because the PieNums in the backend start at 1, not 0. */}
                <PiePlot pieNum={numSaved - i} active={activePie === i} />
              </Col>
              <Col />
            </Row>
          </Carousel.Item>
        );
      })}
    </Carousel>
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
    <React.Fragment>
      {numSaved === null || numSaved === 0 ? (
        <Container
          fluid
          className="text-center bg-primary vh-100 navbar-padding-top-extra"
        >
          <div style={{ maxWidth: "50%", width: "50%", marginLeft: "25%" }}>
            <p className="display-6 fs-1 text-black" style={{ width: "100%" }}>
              {numSaved === null ? "loading..." : "No pies to display."}
            </p>
          </div>
        </Container>
      ) : (
        <Container
          fluid
          className="text-center bg-primary vh-100 navbar-padding-top-extra"
        >
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
            <Row className="bg-primary text-center">
              <p>{activePie + 1}</p>
            </Row>
          )}

          <ApexPieInputDisplay age={age} risk={risk} sector={sector} />
          <ApexPieTable tableRows={tableRows} />
        </Container>
      )}
    </React.Fragment>
  );
};
