import React from "react";
import { Col, Row } from "react-bootstrap";

export interface ApexPieInputDisplayProps {
  age: number;
  risk: number;
  sector: string;
}

export const ApexPieInputDisplay: React.FC<ApexPieInputDisplayProps> = ({
  age,
  risk,
  sector,
}) => {
  return (
    <Row className="bg-primary text-center">
      {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
      <Col md={4} />
      <Col md={4}>
        {/* Display fields chosen by user in User Form */}
        <p className="display-6 fs-4">
          Age: {age}
          <br />
          Risk: {risk}
          <br />
          Sector: {sector}
        </p>
      </Col>
      <Col md={4} />
    </Row>
  );
};
