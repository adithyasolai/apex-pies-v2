import React from "react";
import { Col, Row } from "react-bootstrap";

interface CenteredDivProps {
  children: React.ReactNode;
}

export const CenteredDiv: React.FC<CenteredDivProps> = ({ children }) => (
  <Row>
    <Col md={4}></Col>
    <Col md={4}>{children}</Col>
    <Col md={4}></Col>
  </Row>
);
