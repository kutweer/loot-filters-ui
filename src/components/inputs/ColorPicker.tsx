import { FormControl, Typography } from "@mui/material";
import React, { useState } from "react";
import { RGBColor, SketchPicker } from "react-color";
import {
  ArgbHexColor,
  argbHexColorToRGBColor,
  rGBColorToArgbHex,
} from "../../types/Color";

const ColorPicker: React.FC<{
  color: ArgbHexColor;
  onChange: (color: ArgbHexColor) => void;
  labelText: string;
  labelLocation: "right" | "bottom";
  disabled: boolean;
}> = ({ color, onChange, labelText, labelLocation, disabled }) => {
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
        <div
          style={labelLocation == "right" ? { display: "flex", gap: 2 } : {}}
        >
          <div
            style={{
              padding: "5px",
              background: "#fff",
              borderRadius: "1px",
              boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
              display: "inline-block",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
            onClick={() => {
              if (!disabled) {
                handleClick(displayColorPicker);
              }
            }}
          >
            <div
              style={{
                width: "36px",
                height: labelLocation == "right" ? "100%" : "14px",
                borderRadius: "2px",
                background: disabled
                  ? "#cccccc"
                  : `rgba(${displayColor.r}, ${displayColor.g}, ${displayColor.b}, ${displayColor.a})`,
              }}
            />
          </div>
          <Typography
            style={{
              fontFamily: "RuneScape",
              textAlign: "left",
              marginLeft: labelLocation == "right" ? "10px" : "0px",
            }}
            color={disabled ? "#cccccc" : "inherit"}
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
  labelLocation?: "right" | "bottom";
  disabled?: boolean;
}> = ({ color, onChange, labelText, labelLocation = "bottom", disabled }) => {
  return (
    <FormControl sx={{ marginTop: "auto", marginBottom: "auto" }}>
      <ColorPicker
        labelLocation={labelLocation}
        labelText={labelText}
        color={color}
        onChange={onChange}
        disabled={disabled || false}
      />
    </FormControl>
  );
};

export { ColorPicker, ColorPickerInput };
