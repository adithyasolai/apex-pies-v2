import React from "react";
import { Carousel } from "react-bootstrap";
import { ApexSectorDisplay } from "./ApexSectorDisplay";

interface ApexSectorCarouselProps {
  activeIndex: number;
  onSelect: (selectedIndex: number) => void;
  readonly imageArray: string[];
}

export const ApexSectorCarousel: React.FC<ApexSectorCarouselProps> = ({
  activeIndex,
  onSelect,
  imageArray,
}) => {
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
      {imageArray.map((img: string, index: number) => (
        <Carousel.Item key={index}>
          <ApexSectorDisplay image={img} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};
