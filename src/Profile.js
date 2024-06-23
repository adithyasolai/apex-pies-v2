import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { Card, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import PiePlot from "./PiePlot";

const Profile = () => {
  const { currentUser, signout } = useAuth();
  const [error, setError] = useState("");
  const history = useHistory();

  const uid = useRef(currentUser["uid"])
  const [numSaved, setNumSaved] = useState(0)

  const fetchNumSavedEndpoint = "http://127.0.0.1:5000/fetchnumsaved"

  async function handleSignOut(e) {
    e.preventDefault();

    console.log("Pressed.");

    setError("");

    // username/password sign-up is async b/c we are communicating with Firebase DB
    try {
      await signout();
      // re-direct to log-in after sign-out
      history.push("/login");
    } catch (err) {
      console.log(err);
      setError("Failed to sign out.");
    }
  }

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

  return (
    // TODO: need a bit more top margin because it still looks too close
    <div className="text-center mt-5 bg-primary vh-100">

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {
          Array.from(Array(numSaved), (x, i) => i+1).map((i) => {
            return (
              <div key={i} className="bg-primary">
                <PiePlot pieNum={i.toString()}/>
              </div>
            );
          })
        }
      </div>

      {/* 
        because we do in-line style of no border, then the bg-primary from parent div does not get inherited, and default
        Bootstrap empty white background is applied to Card, so we need to explicitly call bg-primary again.
      */}
      <Card className="bg-primary" style={{border: "none"}}>
        <Card.Body>
          {currentUser && <h3>Current User: {currentUser["email"]}</h3>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Link to="/update-profile" className="text-secondary"> Update Profile </Link>
        </Card.Body>
      </Card>
      
      <div className="bg-primary">
        <Button variant="secondary" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default Profile;