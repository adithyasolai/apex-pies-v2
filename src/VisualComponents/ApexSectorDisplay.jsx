import { Col, Container, Image, Row } from "react-bootstrap";

import * as ApexUtils from "../apexUtils";

export const ApexSectorDisplay = ({ image }) => {
  return (
    <Container fluid>
      <Row>
        <Col />
        <Col xs={12} md={6}>
          <Image
            src={image}
            alt="alt"
            style={{
              border: ApexUtils.SECTOR_IMAGE_BORDER_STYLE,
              borderRadius: "10%",
              // TODO: do with this CSS classes instead
              width: window.screen.width <= 400 ? "75%" : "90%",
            }}
            fluid
          />
        </Col>
        <Col />
      </Row>
    </Container>
  );
};
