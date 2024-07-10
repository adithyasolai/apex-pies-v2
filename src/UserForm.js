import React from "react";
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { withRouter } from "react-router-dom";

import banking_logo from "./resources/sector_icons/banking-sector.jpeg";
import energy_logo from "./resources/sector_icons/energy-sector.jpeg";
import health_logo from "./resources/sector_icons/health-sector.jpeg";
import tech_logo from "./resources/sector_icons/tech-sector.jpeg";

import { useAuth } from "./contexts/AuthContext";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Form, Button, Image, Container, Carousel } from "react-bootstrap";

import uuid from 'react-uuid'

import apiEndpoints from "./api-endpoints.json";
// import apiEndpoints from "./api-endpoints-dev.json";

import "./App.css";

const SECTORS = ["Technology", "Health Care", "Energy ", "Banking"];
const SECTOR_IMAGES = [tech_logo, health_logo, energy_logo, banking_logo];
const NUM_SECTORS = SECTORS.length;

const UserForm = () => {
  const { currentUser } = useAuth();
  const [age, setAge] = useState(18);
  const [risk, setRisk] = useState(1);
  const [sector, setSector] = useState("Technology");
  const [activeSectorImageIndex, setActiveSectorImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  // Domain that routes to ELB
  const makePieEndpoint = apiEndpoints["makePieEndpoint"];

  // Handler for when the user clicks Submit and requests a diversified Pie based on their inputs.
  // A loading screen should show in the front-end immediately after the Submit button is clicked.
  // The loading screen should stay until the backend server confirms that the new Pie has been
  // calculated and stored in the Firebase DB.
  // Once the backend server gives this confirmation, we will serve the PieResults page, which
  // will show another loading screen until the Plotly chart is fetched from the backend.
  async function handleSubmit(event) {
    // Show "Creating Your Pie ..." screen while waiting for Pie to be published to DB
    setLoading(true);

    event.preventDefault();

    // in the case of a guest user, we will generate a temporary UUID for them
    // TODO: delete this UUID and its contents from the DB after the user's session is over
    const uid = currentUser ? currentUser["uid"] : uuid()

    // Send request to backend server to calculate a diversified Pie
    // for the user's selected inputs (age, risk tolerance, and sector).
    // Wait for the request to finish.
    await fetch(makePieEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: uid,
        email: currentUser ? currentUser["email"] : null,
        age: age,
        risk: risk,
        sector: sector,
        is_guest: currentUser ? false : true
      }),
    });

    // Move to the PieResults page after confirming that backend server finished making Pie.
    // Also sends the current state as props to the PieResults page so that
    // the PieResults page has access to the user's selected inputs.
    history.push("/pieresults",
      {
        uid: uid,
        email: currentUser ? currentUser["email"] : null,
        age: age,
        risk: risk,
        sector: sector,
        cameFromUserForm: true
      },
    );
  }

  const handleSelect = (selectedIndex, e) => {
    setActiveSectorImageIndex(selectedIndex % 4);
    setSector(SECTORS[selectedIndex % 4]);
  };

  return (
    // TODO: A better way to do top-margin instead of an explicit px amount

    // TODO: If I add vh-100 to this, then the bg color is only applied to what is in the screen view,
    // and scrolling below that to the bottom part of the form reveals white default bg color.
    // I don't include vh-100 to this, zooming out a bunch beyond the end of the form reveals a white default bg color.
    // Investigate and fix this.

    // Note: Using paddingTop instead of marginTop because marginTop can cause white background to reveal if too much margin is given.
    <Container fluid className="text-center bg-primary vh-100 navbar-padding-top-extra">

      <Form onSubmit={handleSubmit} className="bg-primary">
        <Row className="bg-primary">
          {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
          <Col md={4}/>
          <Col md={4}>
            {/* Title */}
            <p className="h2 fs-1 text-black pb-4">Apex Portfolio Maker</p>

            <p className="display-6 fs-2 text-black">
              Welcome to Apex Pies! An app for people that are looking to invest in publicly-traded companies, but don’t know where to start.
            </p>

            <p className="display-6 fs-1 text-secondary fw-bold">Age</p>

            {/* TODO: Add back hovertext over "Age" and "Sector of Interest" with text defined in ./resources/text */}
            {/* Age Slider */}
            <Form.Control
              type="range"
              min="18"
              max="75"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              // need bg-primary here to make slider bg color match overall bg color
              className="border-dark bg-primary"
            />

            <p className="display-6 fs-1 text-black">{age + " years old"}</p>

            {/* Risk Tolerance Slider */}
            <p className="display-6 fs-1 text-secondary fw-bold">Risk Tolerance</p>

            <Form.Control
              onChange={(e) => setRisk(e.target.value)}
              type="range"
              min="1"
              max="10"
              value={risk}
              className="border-dark bg-primary"
            />

            <p className="display-6 fs-1 text-black">{risk}</p>

            {/* Sector of Interest Hoverable Text */}
            <p className="display-6 fs-1 text-secondary fw-bold">Sector of Interest</p>

            {/* Display currently-selected sector. */}
            <p className="display-6 fs-1 text-black"><strong>{sector}</strong></p>

          </Col>
          <Col md={4}/>
        </Row>

        {/* Sector of Interest Selection */}
        <Row className="bg-primary">
          {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
          <Col/>
          <Col xs={12} md={4}>
            <Carousel
              activeIndex={activeSectorImageIndex}
              onSelect={handleSelect}
              data-bs-theme="dark"
              interval={null} // disables auto-play of carousel
              controls={true} // making left/right arrows show up
              fade={false} // use this to toggle slide vs fade animation while testing
              className="pb-5" // used to make the # of slides slits below the Carousel visible and not hidden behind the Image.
            >
              {Array.from(Array(NUM_SECTORS), (x, i) => i).map((i) => {
                const borderStyle = "5px solid #95bfd0ff";
                return (
                  // TODO: Attempt to add back sector hovertext from ./resources/text, using the simple React Bootstrap tools
                  <Carousel.Item key={SECTOR_IMAGES[i]}>
                    <Container fluid>
                      <Row>
                        <Col/>
                        <Col xs={12} md={6}>
                          <Image
                            src={SECTOR_IMAGES[i]}
                            alt="asdf"
                            style={{ 
                              border: borderStyle,
                              borderRadius: "10%",
                              // TODO: do with this CSS classes instead
                              width: window.screen.width <= 400 ? "75%" : "90%",
                            }}
                            fluid
                          />
                        </Col>
                        <Col/>
                      </Row>
                    </Container>
                  </Carousel.Item>
                );
              })}    
            </Carousel>

            {/* Container wrapper creates some space below button for visual appeal */}
            <Container fluid className="pb-2">
              <Button 
                type="Submit" 
                variant="secondary" 
                size="lg"
                disabled={loading ? true : false}
              >
                Submit
              </Button>
            </Container>

          </Col>
          <Col/>
        </Row>


      </Form>
    </Container>
  );
};

const UserFormWithRouter = withRouter(UserForm);

export default UserFormWithRouter;
