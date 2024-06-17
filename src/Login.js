import React, { useRef, useState } from "react";

import { Card, Form, Button, Alert, Row, Col } from "react-bootstrap";

import { Link } from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";

import { useHistory } from "react-router-dom";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser } = useAuth();
  // default is "" so that we don't have an error by default
  const [error, setError] = useState("");
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    console.log("Pressed.");

    // username/password sign-up is async b/c we are communicating with Firebase DB
    try {
      setError("");
      await login(emailRef.current.value, passwordRef.current.value);
      // re-direct to user profile after logging in
      history.push("/");
    } catch (e) {
      console.log(e);
      setError("Failed to log in to " + emailRef.current.value);
    }
  }

  return (
    // TODO: need a bit more top margin because it still looks too close
    <div className="text-center mt-5">
      <Card style={{border: "none"}}>
        <Card.Body>
          {/* Display a small Error pop-up with the error message from handleSubmit() above. */}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* TODO: Figure out a better way to write this Row/Col stuff in a re-usable way */}
            <Row>
              <Col md={3}></Col>
              <Col md={6}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    className="border-dark"
                    type="email"
                    ref={emailRef}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}></Col>
            </Row>

            <Row className="mt-4">
              <Col md={3}></Col>
              <Col md={6}>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    className="border-dark"
                    type="password"
                    ref={passwordRef}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}></Col>
            </Row>

            <Row className="mt-4">
              <Col md={3}></Col>
              <Col md={6}>
                <Button className="w-100" type="Submit" variant="secondary">
                  Log In
                </Button>
              </Col>
              <Col md={3}></Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      {/* TODO: Figure out how to remove black horizontal line btwn Form above and Div */}

      <div className="mt-3">
        Need an account? <Link to="/signup" className="text-secondary">Sign Up.</Link>
      </div>
    </div>
  );
};

export default Login;
