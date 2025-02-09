import React from "react";
import { Col, Row } from "react-bootstrap";

interface CenteredDivProps {
  rowClassName?: string;
  children: React.ReactNode;
}

export const CenteredDiv: React.FC<CenteredDivProps> = ({ rowClassName, children }) => (
  <Row className={rowClassName || ""}>
    <Col md={4}></Col>
    <Col md={4}>{children}</Col>
    <Col md={4}></Col>
  </Row>
);

// Responsive to end user's screen size
export const CenteredDivResponsive: React.FC<CenteredDivProps> = ({ rowClassName, children }) => (
  <Row className={rowClassName || ""}>
    <Col />
    <Col xs={12} md={6}>{children}</Col>
    <Col />
  </Row>
);
