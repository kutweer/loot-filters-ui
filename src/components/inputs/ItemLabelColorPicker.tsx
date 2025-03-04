import { MenuItem, Select } from "@mui/material";
import { FontType, TextAccent } from "../../types/FilterTypes";
import { ArgbHexColor } from "../../utils/Color";
import { ItemLabelPreview, ItemMenuPreview } from "../Previews";
import { ColorPickerInput } from "./ColorPicker";

export const ItemLabelColorPicker: React.FC<{
  itemName?: string;
  showExamples?: boolean;
  labelLocation?: "right" | "bottom";
  textColor: ArgbHexColor;
  backgroundColor: ArgbHexColor;
  borderColor: ArgbHexColor;
  menuTextColor: ArgbHexColor;
  textAccent: TextAccent;
  textAccentColor: ArgbHexColor;
  fontType: FontType;
  textColorOnChange: (color: ArgbHexColor) => void;
  backgroundColorOnChange: (color: ArgbHexColor) => void;
  borderColorOnChange: (color: ArgbHexColor) => void;
  menuTextColorOnChange: (color: ArgbHexColor) => void;
  textAccentOnChange: (accent: TextAccent) => void;
  textAccentColorOnChange: (color: ArgbHexColor) => void;
  fontTypeOnChange: (font: FontType) => void;
}> = ({
  itemName = "Example",
  showExamples = true,
  labelLocation = "bottom",
  textColor,
  backgroundColor,
  borderColor,
  menuTextColor,
  textAccent = TextAccent.USE_FILTER,
  textAccentColor,
  fontType = FontType.USE_FILTER,
  textColorOnChange,
  backgroundColorOnChange,
  borderColorOnChange,
  menuTextColorOnChange,
  textAccentOnChange,
  textAccentColorOnChange,
  fontTypeOnChange,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
      <ColorPickerInput
        color={textColor}
        labelText="Text Color"
        onChange={(color: ArgbHexColor) => textColorOnChange(color)}
        labelLocation={labelLocation}
      />
      <ColorPickerInput
        color={backgroundColor}
        labelText="Background"
        onChange={(color: ArgbHexColor) => backgroundColorOnChange(color)}
        labelLocation={labelLocation}
      />
      <ColorPickerInput
        color={borderColor}
        labelText="Border"
        onChange={(color: ArgbHexColor) => borderColorOnChange(color)}
        labelLocation={labelLocation}
      />
      <ColorPickerInput
        color={menuTextColor}
        labelText="Menu Text Color"
        onChange={(color: ArgbHexColor) => menuTextColorOnChange(color)}
        labelLocation={labelLocation}
      />
      <Select
        value={textAccent}
        onChange={(event) =>
          textAccentOnChange(event.target.value as TextAccent)
        }
      >
        <MenuItem value={TextAccent.USE_FILTER}>Inherit</MenuItem>
        <MenuItem value={TextAccent.NONE}>None</MenuItem>
        <MenuItem value={TextAccent.SHADOW}>Shadow</MenuItem>
        <MenuItem value={TextAccent.OUTLINE}>Outline</MenuItem>
      </Select>

      <ColorPickerInput
        color={textAccentColor}
        labelText="Text Accent Color"
        onChange={(color: ArgbHexColor) => textAccentColorOnChange(color)}
        labelLocation={labelLocation}
      />
      <Select
        size="small"
        value={fontType}
        onChange={(event) => fontTypeOnChange(event.target.value as FontType)}
      >
        <MenuItem value={FontType.USE_FILTER}>Inherit</MenuItem>
        <MenuItem value={FontType.NORMAL}>Normal</MenuItem>
        <MenuItem value={FontType.LARGER}>Larger</MenuItem>
      </Select>
      {showExamples && (
        <>
          <ItemLabelPreview
            itemName={itemName}
            foregroundColor={textColor}
            backgroundColor={backgroundColor}
            borderColor={borderColor}
          />
          <ItemMenuPreview itemName={itemName} menuTextColor={menuTextColor} />
        </>
      )}
    </div>
  );
};
