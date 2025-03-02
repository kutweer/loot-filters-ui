import { Box, SxProps } from "@mui/material";
import { ArgbHexColor, argbHexToRgbaCss } from "../../types/hexcolor";

export const ExampleItemLabel: React.FC<{
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
        marginTop: "5px",
        height: "80%",
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
