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
import React, { useEffect, useState } from "react";
import { ModuleInput } from "../../types/FilterModule";
import { FontType, TextAccent } from "../../types/FilterTypes";
import { ArgbHexColor } from "../../utils/Color";
import { useSiteConfig } from "../../utils/devmode";
import { ItemLabelPreview, ItemMenuPreview } from "../Previews";
import { ColorPickerInput } from "./ColorPicker";
import { ItemLabelColorPicker } from "./ItemLabelColorPicker";

export const DisplayConfigurationInput: React.FC<{
  input: ModuleInput;
  onChange: (input: ModuleInput) => void;
}> = ({ input, onChange }) => {
  if (input.type !== "style") {
    throw new Error("DisplayConfigurationInput only supports style inputs");
  }

  const [textColor, setTextColor] = useState<ArgbHexColor>(
    input.textColor || "#FF000000"
  );
  const [backgroundColor, setBackgroundColor] = useState<ArgbHexColor>(
    input.backgroundColor || "#FFCCCCCC"
  );
  const [borderColor, setBorderColor] = useState<ArgbHexColor>(
    input.borderColor || "#FF0F00F0"
  );
  const [menuTextColor, setMenuTextColor] = useState<ArgbHexColor>(
    input.menuTextColor || "#FFff9040"
  );
  const [textAccent, setTextAccent] = useState<TextAccent>(
    input.textAccent || TextAccent.NONE
  );
  const [textAccentColor, setTextAccentColor] = useState<ArgbHexColor>(
    input.textAccentColor || "#FF000000"
  );
  const [fontType, setFontType] = useState<FontType>(
    input.fontType || FontType.NORMAL
  );

  const itemLabelColorPicker = (
    <Grid
      size={12}
      sx={{ border: "1px solid red", display: "flex", padding: 1 }}
    >
      <ItemLabelColorPicker
        showExamples={false}
        textColor={textColor}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        menuTextColor={menuTextColor}
        textAccent={textAccent}
        textAccentColor={textAccentColor}
        fontType={fontType}
        textColorOnChange={setTextColor}
        backgroundColorOnChange={setBackgroundColor}
        borderColorOnChange={setBorderColor}
        menuTextColorOnChange={setMenuTextColor}
        textAccentOnChange={setTextAccent}
        textAccentColorOnChange={setTextAccentColor}
        fontTypeOnChange={setFontType}
        labelLocation="right"
      />
    </Grid>
  );

  const [showLootbeam, setShowLootbeam] = useState<boolean>(
    input.showLootbeam || false
  );
  const [lootbeamColor, setLootbeamColor] = useState<ArgbHexColor>(
    input.lootbeamColor || "#FFFF0000"
  );
  const lootbeamComponent = (
    <Grid
      size={4}
      sx={{ border: "1px solid red", display: "flex", padding: 1 }}
    >
      <FormControlLabel
        label="Lootbeam"
        control={
          <Checkbox
            checked={showLootbeam}
            onChange={(e) => setShowLootbeam(e.target.checked)}
          />
        }
      />
      <ColorPickerInput
        color={lootbeamColor}
        onChange={setLootbeamColor}
        labelText={"Lootbeam Color"}
        labelLocation="right"
        disabled={!showLootbeam}
      />
    </Grid>
  );

  const [showValue, setShowValue] = useState<boolean>(input.showValue || false);
  const valueComponent = (
    <FormControlLabel
      label="Show Item Value"
      control={
        <Checkbox
          checked={showValue}
          onChange={(e) => setShowValue(e.target.checked)}
        />
      }
    />
  );

  const [showDespawn, setShowDespawn] = useState<boolean>(
    input.showDespawn || false
  );
  const despawnComponent = (
    <FormControlLabel
      label="Show Despawn Timer"
      control={
        <Checkbox
          checked={showDespawn}
          onChange={(e) => setShowDespawn(e.target.checked)}
        />
      }
    />
  );
  const [notify, setNotify] = useState<boolean>(input.notify || false);
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

  const [hideOverlay, setHideOverlay] = useState<boolean>(
    input.hideOverlay || false
  );
  const hideOverlayComponent = (
    <FormControlLabel
      label="Hide Overlay"
      control={
        <Checkbox
          checked={hideOverlay}
          onChange={(e) => setHideOverlay(e.target.checked)}
        />
      }
    />
  );
  const [highlightTile, setHighlightTile] = useState<boolean>(
    input.highlightTile || false
  );
  const [tileStrokeColor, setTileStrokeColor] = useState<ArgbHexColor>(
    input.tileStrokeColor || "#FF42D47A"
  );
  const [tileFillColor, setTileFillColor] = useState<ArgbHexColor>(
    input.tileFillColor || "#FF3DA3AB"
  );
  const highlightTileComponent = (
    <Grid
      size={8}
      sx={{ border: "1px solid red", display: "flex", gap: 2, padding: 1 }}
    >
      <FormControlLabel
        label="Highlight Tile"
        control={
          <Checkbox
            checked={highlightTile}
            onChange={(e) => setHighlightTile(e.target.checked)}
          />
        }
      />
      <ColorPickerInput
        color={tileStrokeColor}
        onChange={setTileStrokeColor}
        labelText={"Tile Stroke Color"}
        labelLocation="right"
        disabled={!highlightTile}
      />
      <ColorPickerInput
        color={tileFillColor}
        onChange={setTileFillColor}
        labelText={"Tile Fill Color"}
        labelLocation="right"
        disabled={!highlightTile}
      />
    </Grid>
  );

  useEffect(() => {
    onChange({
      ...input,
      textColor,
      backgroundColor,
      borderColor,
      textAccent,
      textAccentColor,
      fontType,
      showLootbeam,
      lootbeamColor,
      showValue,
      showDespawn,
      notify,
      hideOverlay,
      highlightTile,
    });
  }, [
    textColor,
    backgroundColor,
    borderColor,
    textAccent,
    textAccentColor,
    fontType,
    showLootbeam,
    lootbeamColor,
    showValue,
    showDespawn,
    notify,
    hideOverlay,
    highlightTile,
  ]);

  const inputComponents = [
    itemLabelColorPicker,
    lootbeamComponent,
    highlightTileComponent,
    valueComponent,
    despawnComponent,
    notifyComponent,
    hideOverlayComponent,
  ];

  const [siteConfig, setSiteConfig] = useSiteConfig();

  return (
    <Accordion defaultExpanded={siteConfig.devMode || false}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <ItemLabelPreview
            itemName={input.label}
            foregroundColor={textColor}
            backgroundColor={backgroundColor}
            borderColor={borderColor}
          />
          <ItemMenuPreview
            itemName={input.label}
            menuTextColor={menuTextColor}
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
              <Grid
                sx={{ border: "1px solid red", padding: 1 }}
                size={4}
                key={index}
              >
                {component}
              </Grid>
            );
          })}
        </Grid>
        <Box
          sx={{
            height: "100px",
            display: "flex",
            flexDirection: "column",
            flexFlow: "column wrap",
            columns: 3,
            alignItems: "center",
          }}
        ></Box>
      </AccordionDetails>
    </Accordion>
  );
};
