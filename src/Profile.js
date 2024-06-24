import React, { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { Card, Button, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const Profile = () => {
  const { currentUser, signout } = useAuth();
  const [error, setError] = useState("");
  const history = useHistory();

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

  return (
    // TODO: need a bit more top margin because it still looks too close
    <div className="text-center mt-5 bg-primary vh-100">

      {/* 
        because we do in-line style of no border, then the bg-primary from parent div does not get inherited, and default
        Bootstrap empty white background is applied to Card, so we need to explicitly call bg-primary again.
      */}
      <Card className="bg-primary" style={{border: "none"}}>
        <Card.Body>
          {currentUser && <h3>{currentUser["email"]}</h3>}
          {error && <Alert variant="danger">{error}</Alert>}
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