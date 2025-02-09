import React from "react";

import { Card, Form, Button, Alert, Container } from "react-bootstrap";

import { Link } from "react-router-dom";
import { CenteredDiv } from "./VisualComponents/ApexCenteredDiv";
import { ApexSignupLogicalFields, useApexSignup } from "./useApexSignup";

export const Signup = () => {
  const {
    emailRef,
    passwordRef,
    passwordConfirmRef,
    currentUser,
    error,
    handleSubmit,
  }: ApexSignupLogicalFields = useApexSignup();

  return (
    // TODO: need a bit more top margin because it still looks too close
    <Container
      fluid
      className="text-center bg-primary vh-100 navbar-padding-top"
    >
      <Card style={{ border: "none" }} className="bg-primary">
        <Card.Body>
          {/* If there is a currentUser logged in, fetch the user's info from AuthContext and display it in the frontend. */}
          {currentUser &&
            "Current User: " + JSON.stringify(currentUser["email"])}
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
              <Form.Group id="password" className="my-2">
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
              <Form.Group id="password-confirm" className="my-2">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  className="border-dark"
                  type="password"
                  ref={passwordConfirmRef}
                  required
                />
              </Form.Group>
            </CenteredDiv>

            <Button className="my-2" type="submit" variant="secondary">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div className="my-2">
        Already have an account?{" "}
        <Link to="/login" className="text-secondary">
          Log In.
        </Link>
      </div>
    </Container>
  );
};
