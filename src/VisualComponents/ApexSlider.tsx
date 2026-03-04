import React, { ChangeEvent, ChangeEventHandler } from "react";

interface ApexSliderProps {
  input: number;
  min: number;
  max: number;
  onChangeHandler: (value: number) => void;
}

export const ApexSlider: React.FC<ApexSliderProps> = ({
  input,
  min,
  max,
  onChangeHandler,
}) => {
  // Cast given simple state setter to the `ChangeEventHandler` function type expected by the input element.
  const handleChange: ChangeEventHandler = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    onChangeHandler(Number(e.target.value));
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      value={input}
      onChange={handleChange}
      className="w-full accent-sky bg-cream border border-gray-800 rounded"
    />
  );
};
