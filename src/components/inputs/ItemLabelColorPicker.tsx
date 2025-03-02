import { ArgbHexColor } from "../../types/hexcolor";
import { ColorPickerInput } from "./ColorPicker";
import { ExampleItemLabel } from "./ExampleItemLabel";

export const ItemLabelColorPicker: React.FC<{
  textColor: ArgbHexColor;
  backgroundColor: ArgbHexColor;
  borderColor: ArgbHexColor;
  textColorOnChange: (color: ArgbHexColor) => void;
  backgroundColorOnChange: (color: ArgbHexColor) => void;
  borderColorOnChange: (color: ArgbHexColor) => void;
}> = ({
  textColor,
  backgroundColor,
  borderColor,
  textColorOnChange,
  backgroundColorOnChange,
  borderColorOnChange,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
      <ColorPickerInput
        color={textColor}
        labelText="Text Color"
        onChange={(color: ArgbHexColor) => textColorOnChange(color)}
      />
      <ColorPickerInput
        color={backgroundColor}
        labelText="Background"
        onChange={(color: ArgbHexColor) => backgroundColorOnChange(color)}
      />
      <ColorPickerInput
        color={borderColor}
        labelText="Border"
        onChange={(color: ArgbHexColor) => borderColorOnChange(color)}
      />

      <ExampleItemLabel
        itemName="Example"
        foregroundColor={textColor}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
      />
    </div>
  );
};
