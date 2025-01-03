import banking_logo from "./resources/sector_icons/banking-sector.jpeg";
import energy_logo from "./resources/sector_icons/energy-sector.jpeg";
import health_logo from "./resources/sector_icons/health-sector.jpeg";
import tech_logo from "./resources/sector_icons/tech-sector.jpeg";

// UserForm constants
export const SECTORS: string[] = ["Technology", "Health Care", "Energy ", "Banking"];
export const SECTOR_IMAGES: string[] = [
  tech_logo,
  health_logo,
  energy_logo,
  banking_logo,
];
export const SECTOR_IMAGE_BORDER_STYLE: string = "5px solid #95bfd0ff";
export const DEFAULT_USER_FORM_SECTOR: string = "Technology";
export const USER_FORM_MIN_AGE: number = 18;
export const USER_FORM_MAX_AGE: number = 75;
export const USER_FORM_MIN_RISK: number = 1;
export const USER_FORM_MAX_RISK: number = 10;
export const USER_FORM_AGE_HOVERTEXT: string =
  "A higher age will yield a less risky Pie.";
export const USER_FORM_RISK_HOVERTEXT: string =
  "A higher value will yield a riskier Pie.";
export const USER_FORM_SECTOR_HOVERTEXT: string =
  "The Pie will focus on companies from this sector.";
