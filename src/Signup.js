import React, { useRef, useState } from "react";

import { Card, Form, Button, Alert, Row, Col } from "react-bootstrap";

import { useAuth } from "./contexts/AuthContext";

import { Link, useHistory } from "react-router-dom";

const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, currentUser } = useAuth();
  // default is "" so that we don't have an error by default
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // just keeping for future if needed.
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    console.log("Pressed.");

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      console.log("Passwords do not match.");
      return setError("Passwords do not match.");
    }

    // username/password sign-up is async b/c we are communicating with Firebase DB
    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      // re-direct to user profile after signin up
      history.push("/profile");
    } catch (e) {
      // TODO: cast error as a FirebaseError object and parse error message cleanly without revealing
      // that a Firebase database is being used under the hood.
      setError("Failed to create an account. " + e.message);
    }

    setLoading(false);
  }

  return (
    // TODO: need a bit more top margin because it still looks too close
    <div className="text-center mt-5 bg-primary vh-100">
      <Card style={{border: "none"}} className="bg-primary">
        <Card.Body>
          {/* If there is a currentUser logged in, fetch the user's info from AuthContext and display it in the frontend. */}
          {currentUser &&
            "Current User: " + JSON.stringify(currentUser["email"])}
          {/* Display a small Error pop-up with the error message from handleSubmit() above. */}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* TODO: Figure out a better way to write this Row/Col stuff in a re-usable way */}
            <Row>
              <Col md={4}></Col>
              <Col md={4}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control className="border-dark" type="email" ref={emailRef} required />
                </Form.Group>
              </Col>
              <Col md={4}></Col>
            </Row>

            <Row className="my-2">
              <Col md={4}></Col>
              <Col md={4}>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control className="border-dark" type="password" ref={passwordRef} required />
                </Form.Group>
              </Col>
              <Col md={4}></Col>
            </Row>

            <Row className="my-2">
              <Col md={4}></Col>
              <Col md={4}>
                <Form.Group id="password-confirm">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control className="border-dark" type="password" ref={passwordConfirmRef} required />
                </Form.Group>
              </Col>
              <Col md={4}></Col>
            </Row>

            <Button className="my-2" type="Submit" variant="secondary">Sign Up</Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="my-2">
        Already have an account? <Link to="/login" className="text-secondary">Log In.</Link>
      </div>
    </div>
  );
};

export default Signup;
