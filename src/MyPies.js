import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { Carousel, Col, Container, Row } from "react-bootstrap";
import PiePlot from "./PiePlot";

const MyPies = () => {
  const { currentUser } = useAuth();

  const uid = useRef(currentUser["uid"])
  const [numSaved, setNumSaved] = useState(null)

  const [activePie, setActivePie] = useState(1);

  // const fetchNumSavedEndpoint = "http://127.0.0.1:5000/fetchnumsaved"
  const fetchNumSavedEndpoint = "https://api.apex-pies.com:5000/fetchnumsaved"

  useEffect(() => {
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
        setNumSaved( Math.min(numSavedResponse, 4) )

      } catch (err) {
        console.log(err);
      }
    }

    fetchPieData();
  }, []);

  const handleSelect = (selectedIndex, e) => {
    setActivePie(selectedIndex % numSaved);
  };

  return (
    <>
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
          <PiePlot pieNum={numSaved.toString()}/>
        </Container>
      ) : (
        <Container fluid className="bg-primary vh-100 navbar-padding-top-extra">

          {/* IDEA! MAKE ANOTHER CAROUSEL IN USERFORM WITH JUST IMAGES, AND SEE IF MOBILE STILL HAS ISSUES */}
          <Row>
              <Carousel 
                activeIndex={activePie}
                onSelect={handleSelect}
                data-bs-theme="dark"
                interval={null} // disables auto-play of carousel
                controls={true} // making left/right arrows show up
                fade={false} // use this to toggle slide vs fade animation while testing
                className="vw-100"
              >
        
                {
                  Array.from(Array(numSaved), (x, i) => i+1).map((i) => {
                    return (
                      <Carousel.Item key={i} className="vw-100 text-center">
                        <PiePlot pieNum={i.toString()} className=""/>                          
                      </Carousel.Item>
                    );
                  })
                }
                  
              </Carousel>
          </Row>

          <Row className="bg-primary text-center">
            <p>
              {activePie+1}
            </p>
          </Row>
        </Container>
      )}
    </>
  )
}

export default MyPies;