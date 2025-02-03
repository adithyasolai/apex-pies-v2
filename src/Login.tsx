import React from "react";

import {
  Card,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Container,
} from "react-bootstrap";

import { Link } from "react-router-dom";

import { ApexLoginLogicalFields, useApexLogin } from "./useApexLogin";

const Login = () => {
  const {
    emailRef,
    passwordRef,
    error,
    handleSubmit
  }: ApexLoginLogicalFields = useApexLogin();

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
            {/* TODO: Figure out a better way to write this Row/Col stuff in a re-usable way */}
            <Row>
              <Col md={4}></Col>
              <Col md={4}>
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
              <Col md={4}></Col>
            </Row>

            <Row className="mt-4">
              <Col md={4}></Col>
              <Col md={4}>
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
              <Col md={4}></Col>
            </Row>

            <Row className="mt-4">
              <Col md={4}></Col>
              <Col md={4}>
                <Button className="w-100" type="submit" variant="secondary">
                  Log In
                </Button>
              </Col>
              <Col md={4}></Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* TODO: Figure out how to remove black horizontal line btwn Form above and Div */}

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
