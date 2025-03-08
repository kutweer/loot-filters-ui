import { Box, SxProps } from "@mui/material";
import { useUiStore } from "../store/store";
import { colors } from "../styles/MuiTheme";
import { StyleInput } from "../types/InputsSpec";
import { argbHexToRgbaCss } from "../utils/Color";
import { defaultOrConfigOrNone } from "./inputs/StyleInputHelprs";
export const ItemMenuPreview: React.FC<{
  itemName: string;
  input: StyleInput;
}> = ({ itemName, input }) => {

  const activeConfig = useUiStore(
    (state) => state.filterConfigurations[module.id]
  );
  const menuTextColor = argbHexToRgbaCss(
    defaultOrConfigOrNone("menuTextColor", input, activeConfig)
  );

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
                  color: menuTextColor,
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
  input: StyleInput;
  sx?: SxProps;
}> = ({ itemName, input, sx }) => {
  const activeConfig = useUiStore(
    (state) => state.filterConfigurations[module.id]
  );

  const backgroundColor = argbHexToRgbaCss(
    defaultOrConfigOrNone("backgroundColor", input, activeConfig)
  );
  const borderColor = argbHexToRgbaCss(
    defaultOrConfigOrNone("borderColor", input, activeConfig)
  );
  const foregroundColor = argbHexToRgbaCss(
    defaultOrConfigOrNone("textColor", input, activeConfig)
  );

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
          backgroundColor: backgroundColor,
          border: `1px solid ${borderColor}`,
        }}
      >
        <span
          style={{
            padding: "4px",
            color: foregroundColor,
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
