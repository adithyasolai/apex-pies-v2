import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { Carousel } from "react-bootstrap";
import PiePlot from "./PiePlot";

const MyPies = () => {
  const { currentUser } = useAuth();

  const uid = useRef(currentUser["uid"])
  const [numSaved, setNumSaved] = useState(0)

  const [activePie, setActivePie] = useState(1);

  // const fetchNumSavedEndpoint = "http://127.0.0.1:5000/fetchnumsaved"
  const fetchNumSavedEndpoint = "http://api.apex-pies.com:5000/fetchnumsaved"

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
    // TODO: need a bit more top margin because it still looks too close
    <div className="text-center mt-5 bg-primary vh-100">

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
  );
}

export default MyPies;