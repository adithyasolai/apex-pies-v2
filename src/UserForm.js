import React from "react";
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import banking_logo from "./resources/sector_icons/banking-sector.jpeg";
import energy_logo from "./resources/sector_icons/energy-sector.jpeg";
import health_logo from "./resources/sector_icons/health-sector.jpeg";
import tech_logo from "./resources/sector_icons/tech-sector.jpeg";

import { useAuth } from "./contexts/AuthContext";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, Form, Button, Image } from "react-bootstrap";

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

  // local dev endpoint
  // const flask_endpoint = "http://127.0.0.1:5000/"

  // Raw ELB endpoint
  // const flask_endpoint = "http://apex-392442354.us-east-1.elb.amazonaws.com:5000/"

  // Domain that routes to ELB
  const flask_endpoint = "https://api.apex-pies.com:5000/";

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

    // Send request to backend server to calculate a diversified Pie
    // for the user's selected inputs (age, risk tolerance, and sector).
    // Wait for the request to finish.
    await fetch(flask_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: currentUser["uid"],
        email: currentUser["email"],
        age: age,
        risk: risk,
        sector: sector,
      }),
    });

    // Move to the PieResults page after confirming that backend server finished making Pie.
    // Also sends the current state as props to the PieResults page so that
    // the PieResults page has access to the user's selected inputs.
    history.push({
      pathname: "/pieresults",
      state: {
        uid: currentUser["uid"],
        email: currentUser["email"],
        age: age,
        risk: risk,
        sector: sector,
      },
    });
  }

  // Loading screen that is shown immediately after the user clicks Submit button.
  if (loading) {
    return <h2>Creating your Pie ...</h2>;
  }

  return (
    <div className="userForm">
      <Form onSubmit={handleSubmit}>
        {/* missing htmlFor */}

        {/* Title */}
        <h1>Apex Portfolio Maker</h1>

        <div style={{ maxWidth: "50%", width: "50%", marginLeft: "25%" }}>
          <h2 style={{ width: "100%" }}>
            Welcome to Apex Pies! This app is intended for people
            that are looking to start investing, but don’t know where to start.
            Input your age, risk tolerance, and what industry you’d like to invest in the most.
          </h2>
        </div>

        <br />

        {/* Since we use PrivateRoutes, we know that currentUser must be defined if we reach and render this component. */}
        <h3>Current User: {currentUser["email"]}</h3>

        {/* TODO: Add back hovertext over "Age" and "Sector of Interest" with text defined in ./resources/text */}
        {/* Age Slider */}

        <h2>Age</h2>

        <div style={{ maxWidth: "50%", width: "50%", marginLeft: "25%" }}>
          <Form.Control
            type="range"
            min="18"
            max="75"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={{ width: "100%" }} // Set the width to 100%
            className="border-dark"
          />
        </div>
        <h3>{age + " years old"}</h3>

        <br />
        <br />

        {/* Risk Tolerance Slider */}
        <h2>Risk Tolerance</h2>

        <div style={{ maxWidth: "50%", width: "50%", marginLeft: "25%" }}>
          <Form.Control
            onChange={(e) => setRisk(e.target.value)}
            type="range"
            min="1"
            max="10"
            value={risk}
            style={{ width: "100%" }} // Set the width to 100%
            className="border-dark"
          />
        </div>
        <h3>{risk}</h3>

        <br />

        {/* Sector of Interest Hoverable Text */}
        <h2>Sector of Interest</h2>

        <br />

        {/* Display currently-selected sector. */}
        <h3>{sector}</h3>

        {/* Sector of Interest Buttons */}
        <Row>
          {Array.from(Array(NUM_SECTORS), (x, i) => i).map((i) => {
            const borderStyle =
              i === activeSectorImageIndex
                ? "5px solid red"
                : "5px solid #95bfd0ff";

            const opacity = i === activeSectorImageIndex ? "100" : "50";
            return (
              // TODO: the below should be a button, and not an image. (so that screen-readers can read it, and it will be more accesible.)
              // TODO: Attempt to add back sector hovertext from ./resources/text, using the simple React Bootstrap tools
              // eslint-disable-next-line
              <Col
                md={3}
                key={SECTOR_IMAGES[i]} // a React prop used to identify the different images that are rendered dynamically.
              >
                <Image
                  src={SECTOR_IMAGES[i]}
                  data-index={i} // a React prop that is used to define the `index` value that is used later in onClick below.
                  onClick={(event) => {
                    const sectorIndex = +event.target.dataset.index;
                    setActiveSectorImageIndex(sectorIndex);
                    setSector(SECTORS[sectorIndex]);
                  }} // bind gives the click handler function context about what `this` is to access the state.
                  alt="asdf"
                  style={{ border: borderStyle, borderRadius: "10%", width: "75%" }}
                  className={`opacity-${opacity}`}
                />
              </Col>
            );
          })}
        </Row>

        <br />

        <Button type="Submit" variant="primary" size="lg">
          Submit
        </Button>
      </Form>

      <br />

      <Link to={`/profile`}>
        <Button variant="secondary">View Profile</Button>
      </Link>

      <br />
      <br />

      <Link to={`/resourcesfaq`}>
        <Button variant="secondary">Resources and FAQ</Button>
      </Link>
    </div>
  );
};

const UserFormWithRouter = withRouter(UserForm);

export default UserFormWithRouter;
