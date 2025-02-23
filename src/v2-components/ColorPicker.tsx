import { Box, FormControl, InputLabel } from "@mui/material";
import React, { useState } from "react";
import { RGBColor, SketchPicker } from "react-color";
import {
  ArgbHexColor,
  argbHexColorToRGBColor,
  rGBColorToArgbHex,
} from "../types/hexcolor";

const ColorPicker: React.FC<{
  color: ArgbHexColor;
  onChange: (color: ArgbHexColor) => void;
}> = ({ color, onChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = (displayColor: boolean) => {
    setDisplayColorPicker(!displayColor);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color: RGBColor) => {
    onChange(rGBColorToArgbHex(color));
  };

  const displayColor = argbHexColorToRGBColor(color);

  return (
    <div>
      <div
        style={{
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
        }}
        onClick={() => handleClick(displayColorPicker)}
      >
        <div
          style={{
            width: "36px",
            height: "14px",
            borderRadius: "2px",
            background: `rgba(${displayColor.r}, ${displayColor.g}, ${displayColor.b}, ${displayColor.a})`,
          }}
        />
      </div>
      {displayColorPicker ? (
        <div style={{ position: "absolute", zIndex: "2" }}>
          <div
            style={{
              position: "fixed",
              top: "0px",
              right: "0px",
              bottom: "0px",
              left: "0px",
            }}
            onClick={() => handleClose()}
          />
          <SketchPicker
            color={displayColor}
            onChange={(color) => handleChange(color.rgb)}
          />
        </div>
      ) : null}
    </div>
  );
};

const ColorPickerInput: React.FC<{
  color: ArgbHexColor;
  labelText: string;
  onChange: (color: ArgbHexColor) => void;
}> = ({ color, onChange, labelText }) => {
  return (
    <Box>
      <FormControl>
        <ColorPicker color={color} onChange={onChange} />
        <InputLabel className="color-input-label" sx={{ mt: 1 }}>
          {labelText}
        </InputLabel>
      </FormControl>
    </Box>
  );
};

export { ColorPicker, ColorPickerInput };
