import { FormControl, Popover, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { RgbaColorPicker } from "react-colorful";
import { isNumber } from "underscore";
import {
  ArgbHexColor,
  argbHexColorToRGBColor,
  colorHexToRgbaCss,
  normalizeHex,
} from "../../utils/Color";

const colorValid = (color?: ArgbHexColor) => {
  try {
    normalizeHex(color);
    return true;
  } catch (error) {
    return false;
  }
};

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
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (newColor: RGBColor) => {
    const argbColor = rGBColorToArgbHex(newColor);
    onChange(argbColor);
  };

  const [inputTextState, setInputTextState] = useState<string>(color ?? "#FF000000");

  const handleHexChange = (newColor: string) => {
    let error = false;
    const valid = colorValid(newColor as ArgbHexColor);

    setInputTextState(
      valid ? normalizeHex(newColor as ArgbHexColor)!! : newColor,
    );
    if (valid) {
      onChange(newColor as ArgbHexColor);
    }
  };

  const unset = color === undefined;

  const style = {
    width: "36px",
    height: labelLocation == "right" ? "100%" : "14px",
    borderRadius: "2px",
    ...(color && colorValid(color)
      ? { background: colorHexToRgbaCss(color) }
      : {}),
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
                  setAnchorEl(null);
                } else {
                  handleClick(e);
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
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <RgbaColorPicker
            color={
              color && colorValid(color)
                ? argbHexColorToRGBColor(color)
                : {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 1,
                  }
            }
            onChange={handleChange}
          />
          <input
            type="text"
            value={inputTextState}
            style={{ fontFamily: "monospace" }}
            onChange={(e) => handleHexChange(e.target.value)}
          />
          <div style={{ fontSize: "12px", color: "#000" }}>
            <span style={{ fontFamily: "monospace" }}>#AARRGGBB</span>
          </div>
        </div>
      </Popover>
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
