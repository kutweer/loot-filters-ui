import { Box, SxProps } from "@mui/material";
import { colors } from "../styles/MuiTheme";
import { ArgbHexColor, argbHexToRgbaCss } from "../utils/Color";
import { defaultOrConfigOrNone } from "./inputs/StyleInputHelprs";
import { StyleInput } from "../types/ModularFilterSpec";
import { useFilterModule } from "../context/FilterModuleContext";
import { useData } from "../context/UiDataContext";
export const ItemMenuPreview: React.FC<{
  itemName: string;
}> = ({ itemName }) => {
  const { getActiveFilterConfiguration } = useData();
  const { input } = useFilterModule() as { input: StyleInput };
  const activeConf = getActiveFilterConfiguration();

  const menuTextColor = argbHexToRgbaCss(
    defaultOrConfigOrNone("menuTextColor", input, activeConf),
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
  sx?: SxProps;
}> = ({ itemName, sx }) => {
  const { input } = useFilterModule() as { input: StyleInput };
  const { getActiveFilterConfiguration } = useData();
  const activeConf = getActiveFilterConfiguration();

  const backgroundColor = argbHexToRgbaCss(
    defaultOrConfigOrNone("backgroundColor", input, activeConf),
  );
  const borderColor = argbHexToRgbaCss(
    defaultOrConfigOrNone("borderColor", input, activeConf),
  );
  const foregroundColor = argbHexToRgbaCss(
    defaultOrConfigOrNone("textColor", input, activeConf),
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
