import React from "react";
import clsx from "clsx";

import * as ApexUtils from "./apexUtils";
import { ApexIntro } from "./VisualComponents/ApexIntro";
import { ApexSlider } from "./VisualComponents/ApexSlider";
import { ApexHover } from "./VisualComponents/ApexHover";
import { ApexUserFormLogicalFields, useApexUserForm } from "./useApexUserForm";
import { ApexSectorCarousel } from "./VisualComponents/ApexSectorCarousel";
import { CenteredDiv } from "./VisualComponents/ApexCenteredDiv";

export const UserForm: React.FC = () => {
  const {
    formState,
    formStateSetters,
    handleSubmit,
    handleSelect,
  }: ApexUserFormLogicalFields = useApexUserForm();

  return (
    // Note: Using paddingTop instead of marginTop because marginTop can cause white background to reveal if too much margin is given.
    <div className="w-full min-h-screen bg-cream text-center pt-navbar-extra">
      <form onSubmit={handleSubmit} className="bg-cream">
        <CenteredDiv rowClassName="bg-cream">
          <ApexIntro />

          <ApexHover hoverText={ApexUtils.USER_FORM_AGE_HOVERTEXT}>
            <p className="text-2xl lg:text-3xl text-sky font-bold">Age</p>
          </ApexHover>

          <ApexSlider
            input={formState.age}
            min={ApexUtils.USER_FORM_MIN_AGE}
            max={ApexUtils.USER_FORM_MAX_AGE}
            onChangeHandler={(e) => formStateSetters.setAge(e)}
          />

          <p className="text-xl lg:text-2xl text-black">
            {formState.age + " years old"}
          </p>

          <ApexHover hoverText={ApexUtils.USER_FORM_RISK_HOVERTEXT}>
            <p className="text-2xl lg:text-3xl text-sky font-bold">
              Risk Tolerance
            </p>
          </ApexHover>

          <ApexSlider
            input={formState.risk}
            min={ApexUtils.USER_FORM_MIN_RISK}
            max={ApexUtils.USER_FORM_MAX_RISK}
            onChangeHandler={(e) => formStateSetters.setRisk(e)}
          />

          <p className="text-xl lg:text-2xl text-black">{formState.risk}</p>

          <ApexHover hoverText={ApexUtils.USER_FORM_SECTOR_HOVERTEXT}>
            <p className="text-2xl lg:text-3xl text-sky font-bold">
              Sector of Interest
            </p>
          </ApexHover>

          <p className="text-xl lg:text-2xl text-black">
            <strong>{formState.sector}</strong>
          </p>
        </CenteredDiv>

        {/* Sector of Interest Selection */}
        <div className="flex justify-center bg-cream">
          <div className="w-full md:w-1/3">
            <ApexSectorCarousel
              activeIndex={formState.activeSectorImageIndex}
              onSelect={handleSelect}
              imageArray={ApexUtils.SECTOR_IMAGES}
            />

            <div className="pb-2">
              <button
                type="submit"
                disabled={formState.loading}
                className={clsx(
                  "bg-sky text-white px-8 py-3 rounded-lg text-lg font-semibold transition-opacity",
                  formState.loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 cursor-pointer"
                )}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
