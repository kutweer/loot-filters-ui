import { RGBColor } from "react-color";

export const RED = "#ffff0000";
export const GREEN = "#ff00ff00";
export const BLUE = "#ff0000ff";
export const CYAN = "#ff00ffff";
export const MAGENTA = "#ffff00ff";
export const YELLOW = "#ffffff00";
export const WHITE = "#ffffffff";
export const BLACK = "#ff000000";

export const BROWN = "#ffD2B287";
export const LIGHT_BROWN = "#ffAF6025";
export const ORANGE = "#ffF05A23";
export const CARAMEL = "#ffF99619";
export const GOLD = "#ffD59F00";
export const BURGUNDY = "#ff350D0D";
export const DARK_GREEN = "#ff09600D";
export const KHAKI = "#ffBEB287";

export const NO_COLOR = "#00000000";

export type ArgbHexColor =
  | `#${string}`
  | typeof RED
  | typeof GREEN
  | typeof BLUE
  | typeof CYAN
  | typeof MAGENTA
  | typeof YELLOW
  | typeof WHITE
  | typeof BLACK
  | typeof BROWN
  | typeof LIGHT_BROWN
  | typeof ORANGE
  | typeof CARAMEL
  | typeof GOLD
  | typeof BURGUNDY
  | typeof DARK_GREEN
  | typeof KHAKI
  | typeof NO_COLOR;

export type Color = {
  r: string;
  g: string;
  b: string;
  a: string;
};

export const argbToParts = (hex?: ArgbHexColor) => {
  if (!hex) {
    return hex;
  }
  const a = parseInt(hex.slice(1, 3), 16);
  const r = parseInt(hex.slice(3, 5), 16);
  const g = parseInt(hex.slice(5, 7), 16);
  const b = parseInt(hex.slice(7, 9), 16);
  return [r, g, b, a];
};

export const argbHexToRgbaCss = (hex?: ArgbHexColor) => {
  if (!hex) {
    return hex;
  }
  const [r, g, b, a] = argbToParts(hex!!) as number[];
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const rgbHexToArgbHex = (hex: string): ArgbHexColor | undefined => {
  if (!!hex && hex.startsWith("#") && hex.length === 7) {
    return `#ff${hex.slice(1)}`;
  }
  return hex as ArgbHexColor;
};

export const rGBColorToArgbHex = (color: RGBColor): ArgbHexColor => {
  return `#${color.a?.toString(16).padStart(2, "0") || "00"}${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
};

export const argbHexColorToRGBColor = (hex: ArgbHexColor): RGBColor => {
  if (!hex) {
    return hex;
  }
  const [r, g, b, a] = argbToParts(hex) as number[];
  return { r, g, b, a };
};
