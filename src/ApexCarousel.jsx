import { Carousel } from "react-bootstrap";
import { ApexSectorDisplay } from "./ApexSectorDisplay";

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
          return (
            // TODO: Attempt to add back sector hovertext from ./resources/text, using the simple React Bootstrap tools
            <Carousel.Item key={i}>
              <ApexSectorDisplay
                image={img}
              />
            </Carousel.Item>
          );
        }
      )}
    </Carousel>

  );
};