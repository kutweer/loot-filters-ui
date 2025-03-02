import { FormControl, Typography } from "@mui/material";
import React, { useState } from "react";
import { RGBColor, SketchPicker } from "react-color";
import {
  ArgbHexColor,
  argbHexColorToRGBColor,
  rGBColorToArgbHex,
} from "../../types/hexcolor";

const ColorPicker: React.FC<{
  color: ArgbHexColor;
  onChange: (color: ArgbHexColor) => void;
  labelText: string;
}> = ({ color, onChange, labelText }) => {
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
      <div>
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
          <Typography
            style={{
              fontFamily: "RuneScape",
              textAlign: "left",
              fontSize: "1.2rem",
            }}
          >
            {labelText}
          </Typography>
        </div>
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
    <FormControl sx={{ marginTop: "auto", marginBottom: "auto" }}>
      <ColorPicker labelText={labelText} color={color} onChange={onChange} />
    </FormControl>
  );
};

export { ColorPicker, ColorPickerInput };
