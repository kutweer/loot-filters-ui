import { createTheme } from "@mui/material";

const colors = {
  rsYellow: "#ffff00",
  rsOrange: "#ff9300",
  rsDarkBrown: "#2c2721",
  rsLightDarkBrown: "#3d3429",
  rsLightBrown: "#564e43",
  rsLighterBrown: "#706657",
  rsMediumBrown: "#4a4036",
  rsWhite: "#ffffff",
  rsBlack: "#000000",
};

const typography = {
  fontFamily: "RuneScape",
};

export const MuiRsTheme = createTheme({
  typography: {
    fontFamily: "RuneScape",
  },
  palette: {
    primary: {
      main: colors.rsOrange,
      contrastText: colors.rsWhite,
    },
    secondary: {
      main: colors.rsWhite,
      contrastText: colors.rsYellow,
    },
    background: {
      default: colors.rsDarkBrown,
      paper: colors.rsLightDarkBrown,
    },
    divider: colors.rsWhite,
    text: {
      primary: colors.rsOrange,
      secondary: colors.rsLighterBrown,
      disabled: "#cccccc",
    },
    common: {
      black: colors.rsBlack,
      white: colors.rsWhite,
    },
    mode: "dark",
  },
});
