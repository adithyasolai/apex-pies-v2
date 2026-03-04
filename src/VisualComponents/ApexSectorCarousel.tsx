import React from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const prev = () =>
    onSelect(activeIndex > 0 ? activeIndex - 1 : imageArray.length - 1);
  const next = () =>
    onSelect(activeIndex < imageArray.length - 1 ? activeIndex + 1 : 0);

  return (
    <div className="relative pb-8">
      {/* Slide strip */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {imageArray.map((img: string, index: number) => (
            <div key={index} className="min-w-full">
              <ApexSectorDisplay image={img} />
            </div>
          ))}
        </div>
      </div>

      {/* Left arrow */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous sector"
        className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-full p-1 text-gray-800 hover:text-sky transition-colors"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Right arrow */}
      <button
        type="button"
        onClick={next}
        aria-label="Next sector"
        className="absolute right-1/4 top-1/2 -translate-y-1/2 translate-x-full p-1 text-gray-800 hover:text-sky transition-colors"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-2">
        {imageArray.map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => onSelect(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={clsx(
              "w-2 h-2 rounded-full transition-colors",
              i === activeIndex ? "bg-gray-800" : "bg-gray-400"
            )}
          />
        ))}
      </div>
    </div>
  );
};
