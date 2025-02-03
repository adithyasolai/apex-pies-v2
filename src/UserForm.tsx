import React from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";

import * as ApexUtils from "./apexUtils";
import { ApexIntro } from "./VisualComponents/ApexIntro";
import { ApexSlider } from "./VisualComponents/ApexSlider";
import { ApexHover } from "./VisualComponents/ApexHover";
import { ApexCarousel } from "./VisualComponents/ApexCarousel";
import {
  ApexUserFormLogicalFields,
  useApexUserForm,
} from "./useApexUserForm";

const UserForm: React.FC = () => {
  const {
    formState,
    formStateSetters,
    handleSubmit,
    handleSelect,
  }: ApexUserFormLogicalFields = useApexUserForm();

  return (
    // TODO: A better way to do top-margin instead of an explicit px amount

    // TODO: If I add vh-100 to this, then the bg color is only applied to what is in the screen view,
    // and scrolling below that to the bottom part of the form reveals white default bg color.
    // I don't include vh-100 to this, zooming out a bunch beyond the end of the form reveals a white default bg color.
    // Investigate and fix this.

    // Note: Using paddingTop instead of marginTop because marginTop can cause white background to reveal if too much margin is given.
    <Container
      fluid
      className="text-center bg-primary vh-100 navbar-padding-top-extra"
    >
      <Form onSubmit={handleSubmit} className="bg-primary">
        <Row className="bg-primary">
          {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
          <Col md={4} />
          <Col md={4}>
            <ApexIntro />

            {/* TODO: Add back hovertext over "Age" and "Sector of Interest" with text defined in ./resources/text */}
            <ApexHover hoverText={ApexUtils.USER_FORM_AGE_HOVERTEXT}>
              <p className="display-6 fs-2 text-secondary fw-bold">Age</p>
            </ApexHover>

            <ApexSlider
              input={formState.age}
              min={ApexUtils.USER_FORM_MIN_AGE}
              max={ApexUtils.USER_FORM_MAX_AGE}
              onChangeHandler={(e) => formStateSetters.setAge(e)}
            />

            <p className="display-6 fs-3 text-black">
              {formState.age + " years old"}
            </p>

            <ApexHover hoverText={ApexUtils.USER_FORM_RISK_HOVERTEXT}>
              <p className="display-6 fs-2 text-secondary fw-bold">
                Risk Tolerance
              </p>
            </ApexHover>

            <ApexSlider
              input={formState.risk}
              min={ApexUtils.USER_FORM_MIN_RISK}
              max={ApexUtils.USER_FORM_MAX_RISK}
              onChangeHandler={(e) => formStateSetters.setRisk(e)}
            />

            <p className="display-6 fs-3 text-black">{formState.risk}</p>

            <ApexHover hoverText={ApexUtils.USER_FORM_SECTOR_HOVERTEXT}>
              <p className="display-6 fs-2 text-secondary fw-bold">
                Sector of Interest
              </p>
            </ApexHover>

            <p className="display-6 fs-3 text-black">
              <strong>{formState.sector}</strong>
            </p>
          </Col>
          <Col md={4} />
        </Row>

        {/* Sector of Interest Selection */}
        <Row className="bg-primary">
          {/* bg-primary definitely needed above to avoid white slits on the left and right side. */}
          <Col />
          <Col xs={12} md={4}>
            <ApexCarousel
              activeIndex={formState.activeSectorImageIndex}
              onSelect={handleSelect}
              imageArray={ApexUtils.SECTOR_IMAGES}
            />

            {/* Container wrapper creates some space below button for visual appeal */}
            <Container fluid className="pb-2">
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                disabled={formState.loading ? true : false}
              >
                Submit
              </Button>
            </Container>
          </Col>
          <Col />
        </Row>
      </Form>
    </Container>
  );
};

export default UserForm;
