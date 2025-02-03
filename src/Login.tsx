import React from "react";

import { Card, Form, Button, Alert, Container } from "react-bootstrap";

import { Link } from "react-router-dom";

import { ApexLoginLogicalFields, useApexLogin } from "./useApexLogin";
import { CenteredDiv } from "./VisualComponents/ApexCenteredDiv";

const Login = () => {
  const { emailRef, passwordRef, error, handleSubmit }: ApexLoginLogicalFields =
    useApexLogin();

  return (
    <Container fluid className="text-center vh-100 bg-primary">
      {/* 
        because we do in-line style of no border, then the bg-primary from parent div does not get inherited, and default
        Bootstrap empty white background is applied to Card, so we need to explicitly call bg-primary again.
      */}
      <Card
        className="bg-primary navbar-padding-top"
        style={{ border: "none" }}
      >
        <Card.Body>
          {/* Display a small Error pop-up with the error message from handleSubmit() above. */}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* TODO: Look into how to take email and password without multiple Form Groups,
            which is forcing this to use multiple CenteredDivs. */}

            <CenteredDiv>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  className="border-dark"
                  type="email"
                  ref={emailRef}
                  required
                />
              </Form.Group>
            </CenteredDiv>

            <CenteredDiv>
              <Form.Group id="password" className="mt-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  className="border-dark"
                  type="password"
                  ref={passwordRef}
                  required
                />
              </Form.Group>
            </CenteredDiv>

            <CenteredDiv>
              <Button className="w-100 mt-4" type="submit" variant="secondary">
                Log In
              </Button>
            </CenteredDiv>
          </Form>
        </Card.Body>
      </Card>

      <div className="mt-3">
        Need an account?{" "}
        <Link to="/signup" className="text-secondary">
          Sign Up.
        </Link>
      </div>
    </Container>
  );
};

export default Login;
