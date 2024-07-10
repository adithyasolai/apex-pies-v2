import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";

import Plot from 'react-plotly.js';
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useLocation } from "react-router-dom";

import apiEndpoints from "./api-endpoints.json";
// import apiEndpoints from "./api-endpoints-dev.json";

const PieResults = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const uid = useRef(null);
  const age = useRef(null);
  const risk = useRef(null);
  const sector = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saveInProgress, setSaveInProgress] = useState(false)
  const [saveAllowed, setSaveAllowed] = useState(Boolean(currentUser))
  const [saveDone, setSaveDone] = useState(false)

  // backend response data
  const pieId = useRef(null);
  const pie = useRef(null);
  const pieRows = useRef(null);

  // data calculated when backend data is received to make render logic faster
  const numStocks = useRef(0)
  const avgBeta = useRef(0)
  const plotConfig = useRef(null)

  // stock data table fields
  const tableHeadings = ["Sector", "Name", "Ticker", "%"];
  const tableRows = useRef([])

  // Domain that routes to ELB
  const fetchPiesEndpoint = apiEndpoints["fetchPiesEndpoint"]
  const savePiesEndpoint = apiEndpoints["savePiesEndpoint"]

  useEffect(() => {
    uid.current = location.state?.uid;
    age.current = location.state?.age;
    risk.current = location.state?.risk;
    sector.current = location.state?.sector;

    async function fetchPieData() {
      try {
        // Send request to backend server to fetch the Pie & Plotly information
        // for the current userId. Wait for the request to give a response.
        const response = await fetch(fetchPiesEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: uid.current,
            is_guest: currentUser ? false : true
          }),
        });

        // need to also wait for data to arrive
        const json = await response.json();

        // Put all the results from the backend server into our State to be rendered.
        pieId.current = json.pieId
        pie.current = json.pie
        pieRows.current = json.pieRows
        numStocks.current = json.pie['Beta'].length // just using any of the lists to get the length
        avgBeta.current = (Math.round(json.pie['Beta'].reduce((acc, current) => acc + current, 0) / numStocks.current * 100) / 100).toFixed(2)

        // construct table row data
        tableRows.current = pieRows.current.map((dict) => {
          const { Sector, Name, Ticker, Percentage } = dict; // Destructure desired fields
          const percentageString = `${Percentage}%`; // Concatenate '%'
          return { Sector, Name, Ticker, percentageString }; // Create a new object with selected fields
        });

        // construct plot configs as soon as results from backend come
        var data = [{
          values: pie.current['Percentage'],
          labels: pie.current['Ticker'],
          type: 'pie',
          customdata: pieRows.current.map((dict) => [dict['Name'], dict['Sector'], dict['Market Cap'], dict['Beta']]), 
          hovertemplate: 'Ticker: %{label} <br> Name: %{customdata[0][0]} <br> Sector: %{customdata[0][1]} <br> Market Cap: $%{customdata[0][2]} M <br> Beta: %{customdata[0][3]}<extra></extra>',
          marker: {
            colors: pie.current['Color']
          },
        }]

        var layout = {
          paper_bgcolor: 'rgba(0,0,0,0)', 
          plot_bgcolor: 'rgba(0,0,0,0)',
          showlegend: false
        }

        plotConfig.current = {
          'data': data,
          'layout': layout
        }

        // Remove the loading screen so that the page can finally be rendered.
        setLoading(false);

      } catch (err) {
        console.log(err);
      }
    }

    fetchPieData();
  }, []);

  async function handleSaveToProfile(event) {
    setSaveInProgress(true)

    event.preventDefault();

    // Send request to backend server to save this Pie so that it can be retrieved
    // in the Profile page. Wait for the request to finish.
    await fetch(savePiesEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: uid.current
      }),
    });

    // await new Promise((resolve) => setTimeout(resolve, 3000));

    setSaveInProgress(false)
    setSaveAllowed(false)
    setSaveDone(true)
  }

  return (
    <Container fluid className="text-center bg-primary vh-100 navbar-padding-top-extra">
      <Row className="bg-primary">
        {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
        <Col md={4}/>
        <Col md={4}>
          {/* Display fields chosen by user in User Form */}
          <p className="h2">
            Age: {age.current}
            <br />
            Risk: {risk.current}
            <br />
            Sector: {sector.current}
          </p>

          {/* Beta */}
          {/* TODO: Make this hover-text */}
          <p className="h3"> Overall Beta of Pie: {avgBeta.current} </p>
        </Col>
        <Col md={4}/>
      </Row>

      {
        loading ?
        <p> loading ... </p> :
        <Row className="bg-primary">
          <Col className="bg-primary"/>
          <Col xs={12} md={8}>
          <Plot
            data={plotConfig.current['data']}
            layout={plotConfig.current['layout']}
            useResizeHandler={true}
            style={{width: '100%', height: '100%'}}
          />
          </Col>
          <Col className="bg-primary"/>
        </Row>
      }

      <Row className="bg-primary">
        {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
        <Col md={4}/>
        <Col md={4}>
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip >
                {/* This hover will only show if saveAllowed=false */}
                {saveDone ? "Already saved!" : "Log In to save pies!"}
              </Tooltip>
            }
            trigger={saveAllowed ? []: ['focus', 'hover']}
            className="bg-primary"
          >
            <div style={{display: 'inline-block'}} className="bg-primary">
              <Button 
                type="Submit" 
                variant="secondary"
                disabled={saveAllowed ? false : true}
                onClick={handleSaveToProfile}
                style={{
                  opacity: saveAllowed ? 1 : 0.5,
                  cursor: saveAllowed ? 'pointer' : 'not-allowed',
                }}
                >
                Save To Profile
              </Button>
            </div>
          </OverlayTrigger>
          
          <p className="bg-primary"> {saveInProgress ? "saving..." : ""} </p>
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
                {tableRows.current.map((row, rowIndex) => (
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
  );
};

export default withRouter(PieResults);
