import { FormControl, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { RgbaColorPicker } from "react-colorful";
import { isNumber } from "underscore";
import {
  ArgbHexColor,
  argbHexColorToRGBColor,
  colorHexToRgbaCss,
} from "../../utils/Color";

type RGBColor = {
  a: number;
  r: number;
  g: number;
  b: number;
};

const rGBColorToArgbHex = (color: RGBColor): ArgbHexColor => {
  let alpha = color.a;
  if (isNumber(alpha) && (!Number.isInteger(alpha) || alpha === 1)) {
    alpha = Math.round(alpha * 255);
  }

  return `#${alpha?.toString(16).padStart(2, "0") || "00"}${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
};

const ColorPicker: React.FC<{
  color?: ArgbHexColor;
  onChange: (color: ArgbHexColor | undefined) => void;
  labelText: string;
  labelLocation: "right" | "bottom";
  disabled: boolean;
}> = ({ color, onChange, labelText, labelLocation, disabled }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = (displayPicker?: boolean) => {
    setDisplayColorPicker(displayPicker ?? !displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (newColor: RGBColor) => {
    console.log("newColor", newColor);
    const argbColor = rGBColorToArgbHex(newColor);
    onChange(argbColor);
  };

  const unset = color === undefined;

  const style = {
    width: "36px",
    height: labelLocation == "right" ? "100%" : "14px",
    borderRadius: "2px",
    ...(color ? { background: colorHexToRgbaCss(color) } : {}),
  };

  return (
    <div>
      <div>
        <div
          style={labelLocation == "right" ? { display: "flex", gap: 2 } : {}}
        >
          <Tooltip
            title={
              disabled
                ? "Color picker is disabled"
                : !unset
                  ? "Shift + Click to unset color"
                  : "Click to pick a color"
            }
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
              onClick={(e) => {
                if (e.shiftKey) {
                  onChange(undefined);
                  handleClick(false);
                } else if (!disabled) {
                  handleClick();
                }
              }}
            >
              <div
                className={unset ? "unset-color-picker" : ""}
                style={style}
              />
            </div>
          </Tooltip>
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
          <div
            style={{
              backgroundColor: "#fff",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 0 0 1px rgba(0,0,0,.1), 0 8px 16px rgba(0,0,0,.1)",
            }}
          >
            <RgbaColorPicker
              color={
                color
                  ? argbHexColorToRGBColor(color)
                  : {
                      r: 0,
                      g: 0,
                      b: 0,
                      a: 1, // range of 0-1
                    }
              }
              onChange={handleChange}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

const ColorPickerInput: React.FC<{
  color?: ArgbHexColor;
  labelText: string;
  onChange: (color: ArgbHexColor | undefined) => void;
  labelLocation?: "right" | "bottom";
  disabled?: boolean;
  helpText?: string;
}> = ({ color, onChange, labelText, labelLocation, disabled, helpText }) => {
  const labelLocationValue = labelLocation ?? "bottom";
  return (
    <FormControl sx={{ marginTop: "auto", marginBottom: "auto" }}>
      <ColorPicker
        labelLocation={labelLocationValue}
        labelText={labelText}
        color={color}
        onChange={onChange}
        disabled={disabled || false}
      />
      {helpText && (
        <Typography
          sx={{
            color: "#ff0000",
            fontFamily: "RuneScape",
            fontSize: "20px",
            marginTop: "2px",
            whiteSpace: "pre-wrap",
          }}
        >
          {helpText}
        </Typography>
      )}
    </FormControl>
  );
};

export { ColorPicker, ColorPickerInput };
