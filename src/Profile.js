import React, { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { Card, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

export default function Profile() {
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
    <div className="text-center mt-5">
      <Card style={{border: "none"}}>
        <Card.Body>
          {currentUser && <h3>Current User: {currentUser["email"]}</h3>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Link to="/update-profile"> Update Profile </Link>
        </Card.Body>
      </Card>

      <Button variant="secondary" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
}
