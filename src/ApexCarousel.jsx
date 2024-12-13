import { Carousel, Col, Container, Image, Row } from "react-bootstrap";

export const ApexCarousel = ({activeIndex, onSelect, imageArray}) => {
  return (
    <Carousel
      activeIndex={activeIndex}
      onSelect={onSelect}
      data-bs-theme="dark"
      interval={null} // disables auto-play of carousel
      controls={true} // making left/right arrows show up
      fade={false} // use this to toggle slide vs fade animation while testing
      className="pb-5" // used to make the # of slides slits below the Carousel visible and not hidden behind the Image.
    
    >
      {imageArray.map(
        (img, i) => {
          const borderStyle = "5px solid #95bfd0ff";
          return (
            // TODO: Attempt to add back sector hovertext from ./resources/text, using the simple React Bootstrap tools
            <Carousel.Item key={i}>
              <Container fluid>
                <Row>
                  <Col />
                  <Col xs={12} md={6}>
                    <Image
                      src={img}
                      alt="asdf"
                      style={{
                        border: borderStyle,
                        borderRadius: "10%",
                        // TODO: do with this CSS classes instead
                        width:
                          window.screen.width <= 400 ? "75%" : "90%",
                      }}
                      fluid
                    />
                  </Col>
                  <Col />
                </Row>
              </Container>
            </Carousel.Item>
          );
        }
      )}
    </Carousel>

  );
};