import { Box, SxProps } from "@mui/material";
import { useUiStore } from "../store/store";
import { colors } from "../styles/MuiTheme";
import { StyleInput } from "../types/InputsSpec";
import { UiFilterModule } from "../types/ModularFilterSpec";
import { colorHexToRgbaCss } from "../utils/Color";
import { StyleConfig } from "./inputs/StyleInputHelpers";

export const ItemMenuPreview: React.FC<{
  itemName: string;
  input: StyleInput;
  module: UiFilterModule;
}> = ({ itemName, input, module }) => {
  const activeFilterId = useUiStore(
    (state) =>
      Object.keys(state.importedModularFilters).find(
        (id) => state.importedModularFilters[id].active
      )!!
  );

  const activeConfig = useUiStore(
    (state) =>
      state.filterConfigurations?.[activeFilterId!!]?.[module.id]?.[
        input.macroName
      ] as Partial<StyleConfig>
  );

  const menuTextColor = colorHexToRgbaCss(
    activeConfig?.menuTextColor ?? input.default?.menuTextColor
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
  module: UiFilterModule;
  sx?: SxProps;
}> = ({ itemName, input, module, sx }) => {
  const activeFilterId = useUiStore(
    (state) =>
      Object.keys(state.importedModularFilters).find(
        (id) => state.importedModularFilters[id].active
      )!!
  );

  const activeConfig = useUiStore(
    (state) =>
      state.filterConfigurations?.[activeFilterId!!]?.[module.id]?.[
        input.macroName
      ] as Partial<StyleConfig>
  );

  const backgroundColor = colorHexToRgbaCss(
    activeConfig?.backgroundColor ?? input.default?.backgroundColor
  );
  const borderColor = colorHexToRgbaCss(
    activeConfig?.borderColor ?? input.default?.borderColor
  );
  const foregroundColor = colorHexToRgbaCss(
    activeConfig?.textColor ?? input.default?.textColor
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
