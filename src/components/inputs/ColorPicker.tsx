import { FormControl, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { ChromePicker, RGBColor } from "react-color";
import {
  ArgbHexColor,
  argbHexToRgbaCss,
  rGBColorToArgbHex,
} from "../../utils/Color";

const ColorPicker: React.FC<{
  color?: ArgbHexColor;
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

  const unset = color === undefined;

  const baseStyle = {
    width: "36px",
    height: labelLocation == "right" ? "100%" : "14px",
    borderRadius: "2px",
  };
  const style = color
    ? {
        ...baseStyle,
        background: disabled ? "#cccccc" : argbHexToRgbaCss(color),
      }
    : {
        ...baseStyle,
        // backgroundImage: "var(--checkerboard)",
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
              style={
                !unset
                  ? {
                      padding: "5px",
                      background: "#fff",
                      borderRadius: "1px",
                      boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
                      display: "inline-block",
                      cursor: disabled ? "not-allowed" : "pointer",
                    }
                  : undefined
              }
              className={unset ? "unset-color-picker" : ""}
              onClick={() => {
                if (!disabled) {
                  handleClick(displayColorPicker);
                }
              }}
            >
              <div style={style} />
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
          <ChromePicker
            color={color}
            onChange={(color) => handleChange(color.rgb)}
          />
        </div>
      ) : null}
    </div>
  );
};

const ColorPickerInput: React.FC<{
  color?: ArgbHexColor;
  labelText: string;
  onChange: (color: ArgbHexColor) => void;
  labelLocation?: "right" | "bottom";
  disabled?: boolean;
}> = ({
  color,
  onChange,
  labelText,
  labelLocation = "bottom",
  disabled,
}) => {
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
