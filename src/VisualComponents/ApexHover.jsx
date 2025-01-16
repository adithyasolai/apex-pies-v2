import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

export const ApexHover = ({ hoverText, children }) => {
  // Determine if the current screen size is 'xs' or 'md'
  // TODO: Consider doing this globally somewhere instead of each time this component is used/rendered.
  const isXsScreen = useMediaQuery({ maxWidth: 400 });

  return (
    <OverlayTrigger
      placement={isXsScreen ? "bottom" : "right"}
      overlay={<Tooltip>{hoverText}</Tooltip>}
      trigger={["focus", "hover"]}
    >
      {children}
    </OverlayTrigger>
  );
};
