import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  Grid2 as Grid,
} from "@mui/material";
import React, { useState } from "react";
import { colors } from "../../styles/MuiTheme";
import { StyleInput } from "../../types/InputsSpec";
import { ArgbHexColor, rgbHexToArgbHex } from "../../utils/Color";
import useSiteConfig from "../../utils/devmode";
import { ItemLabelPreview, ItemMenuPreview } from "../Previews";
import { ColorPickerInput } from "./ColorPicker";
import { ItemLabelColorPicker } from "./ItemLabelColorPicker";
import {
  updateStyleConfig,
  defaultOrConfigOrNone,
  StyleConfig,
  StyleConfigKey,
} from "./StyleInputHelprs";
import { useUiStore } from "../../store/store";
import { UiFilterModule } from "../../types/ModularFilterSpec";

export const DisplayConfigurationInput: React.FC<{
  module: UiFilterModule;
  input: StyleInput;
}> = ({ module, input }) => {
  const styleInput = input as StyleInput;
  const [siteConfig, _] = useSiteConfig();
  const activeConfig = useUiStore((state) => state.filterConfigurations[module.id]);
  const setFilterConfiguration = useUiStore((state) => state.setFilterConfiguration);

  const updateStyleField = (
    field: StyleConfigKey,
    value: StyleConfig[StyleConfigKey]
  ) => {
    updateStyleConfig(
      field,
      value,
      styleInput,
      activeConfig,
      (config) => setFilterConfiguration(module.id, config)
    );
  };

  const itemLabelColorPicker = (
    <Grid size={12} sx={{ display: "flex", padding: 1 }}>
      <ItemLabelColorPicker showExamples={false} labelLocation="right" />
    </Grid>
  );

  const lootbeamComponent = (
    <Grid size={4} sx={{ display: "flex", padding: 1 }}>
      <FormControlLabel
        label="Lootbeam"
        control={
          <Checkbox
            checked={defaultOrConfigOrNone(
              "showLootbeam",
              styleInput,
              activeConfig
            )}
            onChange={(e) => updateStyleField("showLootbeam", e.target.checked)}
          />
        }
      />
      <ColorPickerInput
        color={defaultOrConfigOrNone("lootbeamColor", styleInput, activeConfig)}
        onChange={(color: ArgbHexColor) =>
          updateStyleField("lootbeamColor", color)
        }
        labelText={"Lootbeam Color"}
        labelLocation="right"
        disabled={defaultOrConfigOrNone("showLootbeam", styleInput, activeConfig)}
      />
    </Grid>
  );

  const valueComponent = (
    <FormControlLabel
      label="Show Item Value"
      control={
        <Checkbox
          checked={defaultOrConfigOrNone("showValue", styleInput, activeConfig)}
          onChange={(e) => updateStyleField("showValue", e.target.checked)}
        />
      }
    />
  );

  const despawnComponent = (
    <FormControlLabel
      label="Show Despawn Timer"
      control={
        <Checkbox
          checked={defaultOrConfigOrNone("showDespawn", styleInput, activeConfig)}
          onChange={(e) => updateStyleField("showDespawn", e.target.checked)}
        />
      }
    />
  );
  const [notify, setNotify] = useState<boolean>(
    styleInput.default?.notify || false
  );
  const notifyComponent = (
    <FormControlLabel
      label="Notify on Drop"
      control={
        <Checkbox
          checked={notify}
          onChange={(e) => setNotify(e.target.checked)}
        />
      }
    />
  );

  const hideOverlayComponent = (
    <FormControlLabel
      label="Hide Overlay"
      control={
        <Checkbox
          checked={defaultOrConfigOrNone("hideOverlay", styleInput, activeConfig)}
          onChange={(e) => updateStyleField("hideOverlay", e.target.checked)}
        />
      }
    />
  );

  const highlightTileComponent = (
    <Grid size={8} sx={{ display: "flex", gap: 2, padding: 1 }}>
      <FormControlLabel
        label="Highlight Tile"
        control={
          <Checkbox
            checked={defaultOrConfigOrNone(
              "highlightTile",
              styleInput,
              activeConfig
            )}
            onChange={(e) =>
              updateStyleField("highlightTile", e.target.checked)
            }
          />
        }
      />
      <ColorPickerInput
        color={defaultOrConfigOrNone("tileStrokeColor", styleInput, activeConfig)}
        onChange={(color: ArgbHexColor) =>
          updateStyleField("tileStrokeColor", color)
        }
        labelText={"Tile Stroke Color"}
        labelLocation="right"
        disabled={
          !defaultOrConfigOrNone("highlightTile", styleInput, activeConfig)
        }
      />
      <ColorPickerInput
        color={defaultOrConfigOrNone("tileFillColor", styleInput, activeConfig)}
        onChange={(color: ArgbHexColor) =>
          updateStyleField("tileFillColor", color)
        }
        labelText={"Tile Fill Color"}
        labelLocation="right"
        disabled={
          !defaultOrConfigOrNone("highlightTile", styleInput, activeConfig)
        }
      />
    </Grid>
  );

  const inputComponents = [
    itemLabelColorPicker,
    lootbeamComponent,
    highlightTileComponent,
    valueComponent,
    despawnComponent,
    notifyComponent,
    hideOverlayComponent,
  ];

  return (
    <Accordion
      sx={{
        backgroundColor: colors.rsLightBrown,
      }}
      slotProps={{ transition: { unmountOnExit: true } }}
      defaultExpanded={siteConfig.devMode}
    >
      <AccordionSummary
        sx={{
          backgroundColor: colors.rsLightBrown,
        }}
        expandIcon={<ExpandMore />}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <ItemLabelPreview input={input} itemName={input.label} />
          <ItemMenuPreview input={input} itemName={input.label} />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {inputComponents.map((component, index) => {
            if (component.type.muiName === "Grid") {
              return React.cloneElement(component, {
                key: index,
              });
            }
            return (
              <Grid sx={{ padding: 1 }} size={4} key={index}>
                {component}
              </Grid>
            );
          })}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
