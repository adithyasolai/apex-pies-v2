import React, { JSX } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Placement } from "react-bootstrap/esm/types";
import { useMediaQuery } from "react-responsive";

interface ApexHoverProps {
  hoverText: string;
  children: React.ReactElement;
}

export const ApexHover: React.FC<ApexHoverProps> = ({
  hoverText,
  children,
}): JSX.Element => {
  // Determine if the current screen size is 'xs' or 'md'
  // TODO: Consider doing this globally somewhere instead of each time this component is used/rendered.
  const isXsScreen: boolean = useMediaQuery({ maxWidth: 400 });
  const hoverTextPlacement: Placement = isXsScreen ? "bottom" : "right";

  return (
    <OverlayTrigger
      placement={hoverTextPlacement}
      overlay={<Tooltip>{hoverText}</Tooltip>}
      trigger={["focus", "hover"]}
    >
      {children}
    </OverlayTrigger>
  );
};
