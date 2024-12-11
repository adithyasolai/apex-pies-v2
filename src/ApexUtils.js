import banking_logo from "./resources/sector_icons/banking-sector.jpeg";
import energy_logo from "./resources/sector_icons/energy-sector.jpeg";
import health_logo from "./resources/sector_icons/health-sector.jpeg";
import tech_logo from "./resources/sector_icons/tech-sector.jpeg";

// UserForm constants
export const SECTORS = ["Technology", "Health Care", "Energy ", "Banking"];
export const SECTOR_IMAGES = [
  tech_logo,
  health_logo,
  energy_logo,
  banking_logo,
];
export const NUM_SECTORS = SECTORS.length;
export const DEFAULT_USER_FORM_SECTOR = "Technology";
export const USER_FORM_MIN_AGE = 18;
export const USER_FORM_MAX_AGE = 75;
export const USER_FORM_MIN_RISK = 1;
export const USER_FORM_MAX_RISK = 10;
export const USER_FORM_AGE_HOVERTEXT =
  "A higher age will yield a less risky Pie.";
export const USER_FORM_RISK_HOVERTEXT =
  "A higher value will yield a riskier Pie.";
export const USER_FORM_SECTOR_HOVERTEXT =
  "The Pie will focus on companies from this sector.";

//
