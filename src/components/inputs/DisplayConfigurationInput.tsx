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
import { StyleInput } from "../../types/ModularFilterSpec";
import { ArgbHexColor, rgbHexToArgbHex } from "../../utils/Color";
import useSiteConfig from "../../utils/devmode";
import { useData } from "../../utils/storage";
import { ItemLabelPreview, ItemMenuPreview } from "../Previews";
import { ColorPickerInput } from "./ColorPicker";
import { ItemLabelColorPicker } from "./ItemLabelColorPicker";
import { updateStyleConfig, defaultOrConfigOrNone, StyleConfig, StyleConfigKey } from "./StyleInputHelprs";

export const DisplayConfigurationInput: React.FC<{
  input: StyleInput;
}> = ({ input }) => {
  const styleInput = input as StyleInput;

  const [siteConfig, _] = useSiteConfig();
  const { getActiveFilterConfiguration, updateConfigurationForActiveFilter } =
    useData();

  const activeConf = getActiveFilterConfiguration();  

  const updateStyleField = (field: StyleConfigKey, value: StyleConfig[StyleConfigKey]) => {
    updateStyleConfig(field, value, styleInput, activeConf, updateConfigurationForActiveFilter);
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
            checked={defaultOrConfigOrNone("showLootbeam", styleInput, activeConf)}
            onChange={(e) => updateStyleField("showLootbeam", e.target.checked)}
          />
        }
      />
      <ColorPickerInput
        color={defaultOrConfigOrNone("lootbeamColor", styleInput, activeConf)}
        onChange={(color: ArgbHexColor) => updateStyleField("lootbeamColor", color)}
        labelText={"Lootbeam Color"}
        labelLocation="right"
        disabled={defaultOrConfigOrNone("showLootbeam", styleInput, activeConf)}
      />
    </Grid>
  );

  const valueComponent = (
    <FormControlLabel
      label="Show Item Value"
      control={
        <Checkbox
          checked={defaultOrConfigOrNone("showValue", styleInput, activeConf)}
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
          checked={defaultOrConfigOrNone("showDespawn", styleInput, activeConf)}
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
          checked={defaultOrConfigOrNone("hideOverlay", styleInput, activeConf)}
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
            checked={defaultOrConfigOrNone("highlightTile", styleInput, activeConf)}
            onChange={(e) => updateStyleField("highlightTile", e.target.checked)}
          />
        }
      />
      <ColorPickerInput
        color={defaultOrConfigOrNone("tileStrokeColor", styleInput, activeConf)}
        onChange={(color: ArgbHexColor) => updateStyleField("tileStrokeColor", color)}
        labelText={"Tile Stroke Color"}
        labelLocation="right"
        disabled={!defaultOrConfigOrNone("highlightTile", styleInput, activeConf)}
      />
      <ColorPickerInput
        color={defaultOrConfigOrNone("tileFillColor", styleInput, activeConf)}
        onChange={(color: ArgbHexColor) => updateStyleField("tileFillColor", color)}
        labelText={"Tile Fill Color"}
        labelLocation="right"
        disabled={!defaultOrConfigOrNone("highlightTile", styleInput, activeConf)}
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
      defaultExpanded={siteConfig.devMode}
    >
      <AccordionSummary
        sx={{
          backgroundColor: colors.rsLightBrown,
        }}
        expandIcon={<ExpandMore />}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <ItemLabelPreview
            itemName={input.label}
          />
          <ItemMenuPreview
            itemName={input.label}
          />
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
