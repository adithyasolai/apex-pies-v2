import { Form } from "react-bootstrap";

export const ApexSlider = ({ input, min, max, onChangeHandler }) => {
  return (
    <Form.Control
      type="range"
      min={min}
      max={max}
      value={input}
      onChange={onChangeHandler}
      // need bg-primary here to make slider bg color match overall bg color
      className="border-dark bg-primary"
    />
  );
};
