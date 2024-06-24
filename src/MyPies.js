import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { Carousel } from "react-bootstrap";
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
        <div className="text-center bg-primary vh-100" style={{paddingTop: "75px"}}>
          <div style={{ maxWidth: "50%", width: "50%", marginLeft: "25%" }}>
            <p className="display-6 fs-1 text-black" style={{ width: "100%" }}>
              loading...
            </p>
          </div>
        </div>
      ) : numSaved === 0 ? (
        <div className="text-center bg-primary vh-100" style={{paddingTop: "75px"}}>
          <div style={{ maxWidth: "50%", width: "50%", marginLeft: "25%" }}>
            <p className="display-6 fs-1 text-black" style={{ width: "100%" }}>
              No pies to display.
            </p>
          </div>
        </div>
      ) : numSaved === 1 ? (
        <div className="text-center bg-primary vh-100" style={{paddingTop: "75px"}}>
          <PiePlot pieNum={numSaved.toString()}/>
        </div>
      ) : (
        <div className="text-center bg-primary vh-100" style={{paddingTop: "75px"}}>
  
          <Carousel 
            activeIndex={activePie}
            onSelect={handleSelect}
            data-bs-theme="dark"
            interval={null}
            controls={true}
            fade={false} // use this to toggle slide vs fade animation while testing
            style={{width: '50%', margin: 'auto'}}
          >
    
            {
              Array.from(Array(numSaved), (x, i) => i+1).map((i) => {
                return (
                  <Carousel.Item key={i} className="mb-5">
                    <PiePlot pieNum={i.toString()}/>
                  </Carousel.Item>
                );
              })
            }
              
          </Carousel>
    
          <p>
            {activePie+1}
          </p>
        </div>
      )}
    </>
  )
}

export default MyPies;