import React, { useEffect } from "react";
import { Carousel, Col, Container, Row, Table } from "react-bootstrap";
import PiePlot from "./PiePlot";
import { ApexMyPiesLogicalFields, useApexMyPies } from "./useApexMyPies";

const MyPies = () => {
  const {
    numSaved,
    activePie,
    age,
    risk,
    sector,
    tableRows,
    fetchPieData,
    fetchSavedPieData,
    handleSelect
  }: ApexMyPiesLogicalFields = useApexMyPies();

  const tableHeadings = ["Sector", "Name", "Ticker", "%"];

  useEffect(() => {
    fetchPieData();
  }, [fetchPieData]);

  useEffect(() => {
    if (numSaved !== null) {
      fetchSavedPieData();
    }
  }, [numSaved, activePie, fetchSavedPieData]);

  return (
    <React.Fragment>
      {/* TODO: Refactor this to avoid duplicate code. */}
      {(numSaved === null || numSaved === 0)? (
        <Container
          fluid
          className="text-center bg-primary vh-100 navbar-padding-top-extra"
        >
          <div style={{ maxWidth: "50%", width: "50%", marginLeft: "25%" }}>
            <p className="display-6 fs-1 text-black" style={{ width: "100%" }}>
              {numSaved === null  ? "loading..." : "No pies to display."}
            </p>
          </div>
        </Container>
      ) : numSaved === 1 ? (
        <Container
          fluid
          className="text-center bg-primary vh-100 navbar-padding-top-extra"
        >
          <Row>
            <Col />
            <Col xs={12} md={6}>
              <PiePlot pieNum={numSaved} active={true} />
            </Col>
            <Col />
          </Row>

          <Row className="bg-primary text-center">
            {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
            <Col md={4} />
            <Col md={4}>
              {/* Display fields chosen by user in User Form */}
              <p className="display-6 fs-4">
                Age: {age}
                <br />
                Risk: {risk}
                <br />
                Sector: {sector}
              </p>
            </Col>
            <Col md={4} />
          </Row>

          <Row className="bg-primary">
            {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
            <Col />
            <Col xs={12} md={6}>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    {tableHeadings.map((heading, index) => (
                      <th key={index}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.keys(row).map((key, colIndex) => (
                        <td key={`${rowIndex}-${colIndex}`}>{row[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col />
          </Row>
        </Container>
      ) : (
        <Container fluid className="bg-primary vh-100 navbar-padding-top">
          <Row>
            <Col />
            <Col xs={12} md={6}>
              <Carousel
                activeIndex={activePie}
                onSelect={handleSelect}
                data-bs-theme="dark" // makes left/arrows black
                interval={null} // disables auto-play of carousel
                controls={true} // making left/right arrows show up
                fade={false} // use this to toggle slide vs fade animation while testing
              >
                {Array.from(Array(Math.min(numSaved, 4)), (x, i) => i).map(
                  (i) => {
                    return (
                      <Carousel.Item key={i}>
                        <Container fluid>
                          <Row>
                            <Col />
                            <Col xs={12} md={8}>
                              {/* The `numSaved-i` allows the most recent 4 pies to be shown */}
                              {/* It works because the PieNums in the backend start at 1, not 0. */}
                              <PiePlot
                                pieNum={(numSaved - i)}
                                active={activePie === i}
                              />
                            </Col>
                            <Col />
                          </Row>
                        </Container>
                      </Carousel.Item>
                    );
                  }
                )}
              </Carousel>
            </Col>
            <Col />
          </Row>

          <Row className="bg-primary text-center">
            <p>{activePie + 1}</p>
          </Row>

          <Row className="bg-primary text-center">
            {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
            <Col md={4} />
            <Col md={4}>
              {/* Display fields chosen by user in User Form */}
              <p className="display-6 fs-4">
                Age: {age}
                <br />
                Risk: {risk}
                <br />
                Sector: {sector}
              </p>
            </Col>
            <Col md={4} />
          </Row>

          <Row className="bg-primary">
            {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
            <Col />
            <Col xs={12} md={6}>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    {tableHeadings.map((heading, index) => (
                      <th key={index}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.keys(row).map((key, colIndex) => (
                        <td key={`${rowIndex}-${colIndex}`}>{row[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col />
          </Row>
        </Container>
      )}
    </React.Fragment>
  );
};

export default MyPies;
