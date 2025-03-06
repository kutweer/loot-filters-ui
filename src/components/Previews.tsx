import { Box, SxProps } from "@mui/material";
import { colors } from "../styles/MuiTheme";
import { ArgbHexColor, argbHexToRgbaCss } from "../utils/Color";

export const ItemMenuPreview: React.FC<{
  itemName: string;
  menuTextColor: ArgbHexColor;
}> = ({ itemName, menuTextColor }) => {
  return (
    <Box>
      <div
        style={{
          display: "flex",
          backgroundColor: colors.rsLightBrown,
          border: `1px solid ${colors.rsLightBrown}`,
        }}
      >
        <div
          style={{
            borderRadius: "2px",
          }}
        >
          <div
            style={{
              color: colors.rsLightBrown,
              fontFamily: "RuneScape",
              fontSize: "24px",
              border: `1px solid ${colors.rsLightBrown}`,
              borderRadius: "2px",
              backgroundColor: colors.rsBlack,
            }}
          >
            Choose Option
          </div>
          <div
            style={{
              border: `2px solid ${colors.rsBlack}`,
              backgroundColor: colors.rsLightBrown,
            }}
          >
            <div style={{ margin: "2px" }}>
              <span
                style={{
                  color: colors.rsWhite,
                  fontFamily: "RuneScape",
                  fontSize: "24px",
                }}
              >
                Take{" "}
              </span>
              <span
                style={{
                  color: `${argbHexToRgbaCss(menuTextColor)}`,
                  fontFamily: "RuneScape",
                  fontSize: "24px",
                }}
              >
                {itemName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export const ItemLabelPreview: React.FC<{
  itemName: string;
  foregroundColor: ArgbHexColor;
  backgroundColor: ArgbHexColor;
  borderColor: ArgbHexColor;
  sx?: SxProps;
}> = ({ itemName, foregroundColor, backgroundColor, borderColor, sx }) => {
  return (
    <Box
      sx={{
        border: "3px solid black",
        backgroundColor: "#dddddd",
        ...sx,
      }}
    >
      <div
        style={{
          margin: "10px",
          display: "flex",
          alignItems: "center",
          gap: 2,
          backgroundColor: argbHexToRgbaCss(backgroundColor),
          border: `1px solid ${argbHexToRgbaCss(borderColor)}`,
        }}
      >
        <span
          style={{
            padding: "4px",
            color: argbHexToRgbaCss(foregroundColor),
            fontSize: "24px",
            fontFamily: "RuneScape",
          }}
        >
          {itemName || "Item Name"}
        </span>
      </div>
    </Box>
  );
};
