import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { Carousel, Col, Container, Row, Table } from "react-bootstrap";
import PiePlot from "./PiePlot";

import apiEndpoints from "./api-endpoints.json";
// import apiEndpoints from "./api-endpoints-dev.json";

const MyPies = () => {
  const { currentUser } = useAuth();

  const uid = useRef(currentUser["uid"])
  const [numSaved, setNumSaved] = useState(null)
  const numSavedRef = useRef(null)

  const age = useRef(null);
  const risk = useRef(null);
  const sector = useRef(null);

  const [activePie, setActivePie] = useState(0);

  // backend response data
  const pie = useRef(null);
  const pieRows = useRef(null);

  // stock data table fields
  const tableHeadings = ["Sector", "Name", "Ticker", "%"];
  const [tableRows, setTableRows] = useState([]);

  // Domain that routes to ELB
  const fetchNumSavedEndpoint = apiEndpoints["fetchNumSavedEndpoint"]
  const fetchSavedPieEndpoint = apiEndpoints["fetchSavedPieEndpoint"]

  async function fetchPieData() {
    try {
      // Send request to backend server to fetch the Pie & Plotly information
      // for the current userId. Wait for the request to give a response.
      const response = await fetch(fetchNumSavedEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid.current,
        }),
      });

      // need to also wait for data to arrive
      const numSavedResponse = await response.json();

      // Put all the results from the backend server into our State to be rendered.
      // TODO: figure out better logic than a flat 4 limit
      setNumSaved( numSavedResponse )

      numSavedRef.current = numSavedResponse

    } catch (err) {
      console.log(err);
    }
  }

  async function fetchSavedPieData() {
    try {

      // Send request to backend server to fetch the Pie & Plotly information
      // for the current userId. Wait for the request to give a response.
      const response = await fetch(fetchSavedPieEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid.current,
          pieNum: (numSavedRef.current - activePie).toString()
        }),
      });

      // need to also wait for data to arrive
      const json = await response.json();

      // Put all the results from the backend server into our State to be rendered.
      pie.current = json.pie
      pieRows.current = json.pieRows
      age.current = json.age;
      risk.current = json.risk;
      sector.current = json.primarySector;

      // construct table row data
      setTableRows(pieRows.current.map((dict) => {
        const { Sector, Name, Ticker, Percentage } = dict; // Destructure desired fields
        const percentageString = `${Percentage}%`; // Concatenate '%'
        return { Sector, Name, Ticker, percentageString }; // Create a new object with selected fields
      }));

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchPieData();
  }, []);

  useEffect(() => {
    if (numSaved !== null) {
      fetchSavedPieData();
    }
  }, [numSaved, activePie]);

  const handleSelect = (selectedIndex, e) => {
    setActivePie(selectedIndex);
  };

  return (
    <>
    {/* TODO: Refactor this to avoid duplicate code. */}
      {numSaved === null ? (
        <Container fluid className="text-center bg-primary vh-100 navbar-padding-top-extra">
          <div style={{ maxWidth: "50%", width: "50%", marginLeft: "25%" }}>
            <p className="display-6 fs-1 text-black" style={{ width: "100%" }}>
              loading...
            </p>
          </div>
        </Container>
      ) : numSaved === 0 ? (
        <Container fluid className="text-center bg-primary vh-100 navbar-padding-top-extra">
          <div style={{ maxWidth: "50%", width: "50%", marginLeft: "25%" }}>
            <p className="display-6 fs-1 text-black" style={{ width: "100%" }}>
              No pies to display.
            </p>
          </div>
        </Container>
      ) : numSaved === 1 ? (
        <Container fluid className="text-center bg-primary vh-100 navbar-padding-top-extra">
          <Row>
              <Col/>
              <Col xs={12} md={6}>
                <PiePlot pieNum={numSaved.toString()} active={true}/>
              </Col>
              <Col/>
          </Row>

          <Row className="bg-primary text-center">
            {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
            <Col md={4}/>
            <Col md={4}>
              {/* Display fields chosen by user in User Form */}
              <p className="display-6 fs-4">
                Age: {age.current}
                <br />
                Risk: {risk.current}
                <br />
                Sector: {sector.current}
              </p>
            </Col>
            <Col md={4}/>
          </Row>

          <Row className="bg-primary">
            {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
            <Col/>
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
            <Col/>
          </Row>
        </Container>
      ) : (
        <Container fluid className="bg-primary vh-100 navbar-padding-top">
          <Row>
              <Col/>
              <Col xs={12} md={6}>
              <Carousel 
                activeIndex={activePie}
                onSelect={handleSelect}
                data-bs-theme="dark" // makes left/arrows black
                interval={null} // disables auto-play of carousel
                controls={true} // making left/right arrows show up
                fade={false} // use this to toggle slide vs fade animation while testing
              >
                {
                  Array.from(Array(Math.min(numSaved, 4)), (x, i) => i).map((i) => {
                    return (
                      <Carousel.Item key={i}>
                        <Container fluid>
                          <Row>
                            <Col/>
                            <Col xs={12} md={8}>
                              {/* The `numSaved-i` allows the most recent 4 pies to be shown */}
                              {/* It works because the PieNums in the backend start at 1, not 0. */}
                              <PiePlot pieNum={(numSaved-i).toString()} active={activePie === i} />
                            </Col>
                            <Col/>
                          </Row>
                        </Container>
                      </Carousel.Item>
                    );
                  })
                }
              </Carousel>
              </Col>
              <Col/>
          </Row>

          <Row className="bg-primary text-center">
            <p>
              {activePie+1}
            </p>
          </Row>

          <Row className="bg-primary text-center">
            {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
            <Col md={4}/>
            <Col md={4}>
              {/* Display fields chosen by user in User Form */}
              <p className="display-6 fs-4">
                Age: {age.current}
                <br />
                Risk: {risk.current}
                <br />
                Sector: {sector.current}
              </p>
            </Col>
            <Col md={4}/>
          </Row>

          <Row className="bg-primary">
            {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
            <Col/>
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
            <Col/>
          </Row>

        </Container>
      )}
    </>
  )
}

export default MyPies;