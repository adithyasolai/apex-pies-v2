import React, { ChangeEvent, ChangeEventHandler, JSX } from "react";

import { Form } from "react-bootstrap";

interface ApexSliderProps {
  input: number;
  min: number;
  max: number;
  onChangeHandler: (value: number) => void;
}

export const ApexSlider: React.FC<ApexSliderProps> = ({ input, min, max, onChangeHandler }): JSX.Element => {
  // Cast given simple state setter to the `ChangeEventHandler` function type expected by Bootstrap Form.
  const handleChange: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeHandler(Number(e.target.value));
  }

  return (
    <Form.Control
      type="range"
      min={min}
      max={max}
      value={input}
      onChange={handleChange}
      className="border-dark bg-primary"
    />
  );
};
