import { Col, Container, Image, Row } from "react-bootstrap";

import React from "react";

interface ApexSectorDisplayProps {
  image: string;
}

export const ApexSectorDisplay: React.FC<ApexSectorDisplayProps> = ({
  image,
}) => {
  // TODO: do with this CSS classes instead
  const imageWidth: string = window.screen.width <= 400 ? "75%" : "90%";
  const imageBorderRadius: string = "10%";
  const imageBorderStyle: string = "5px solid #95bfd0ff";

  return (
    <Container fluid>
      <Row>
        <Col />
        <Col xs={12} md={6}>
          <Image
            src={image}
            alt="Sector Image"
            style={{
              border: imageBorderStyle,
              borderRadius: imageBorderRadius,
              width: imageWidth,
            }}
            fluid
          />
        </Col>
        <Col />
      </Row>
    </Container>
  );
};
