import React, { JSX } from "react";
import { Carousel } from "react-bootstrap";
import { ApexSectorDisplay } from "./ApexSectorDisplay";

interface ApexCarouselProps {
  activeIndex: number;
  onSelect: (selectedIndex: number) => void;
  readonly imageArray: string[];
}

export const ApexCarousel: React.FC<ApexCarouselProps> = ({
  activeIndex,
  onSelect,
  imageArray,
}): JSX.Element => {
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
