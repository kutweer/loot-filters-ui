import { useFilterModule } from "../../context/FilterModuleContext";
import { useInput } from "../../context/InputContext";
import { useData } from "../../context/UiDataContext";
import {
  FontType,
  fontTypeFromOrdinal,
  fontTypeOrdinal,
  StyleInput,
} from "../../types/ModularFilterSpec";
import { ArgbHexColor } from "../../utils/Color";
import { ItemLabelPreview, ItemMenuPreview } from "../Previews";
import { ConfiguredAutoComplete } from "./BasicInputs";
import { ColorPickerInput } from "./ColorPicker";
import {
  defaultOrConfigOrNone,
  StyleConfig,
  StyleConfigKey,
  updateStyleConfig,
} from "./StyleInputHelprs";

type Option = {
  label: string;
  value: string;
};

export const ItemLabelColorPicker: React.FC<{
  itemName?: string;
  showExamples?: boolean;
  labelLocation?: "right" | "bottom";
}> = ({
  itemName = "Example",
  showExamples = true,
  labelLocation = "bottom",
}) => {
  const { input } = useInput() as { input: StyleInput };
  const { activeConfig, setActiveConfig } = useFilterModule();

  const updateStyleField = (
    field: StyleConfigKey,
    value: StyleConfig[StyleConfigKey]
  ) => {
    updateStyleConfig(
      field,
      value,
      input,
      activeConfig,
      setActiveConfig
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
      <ColorPickerInput
        color={defaultOrConfigOrNone("textColor", input, activeConfig)}
        labelText="Text Color"
        onChange={(color: ArgbHexColor) => updateStyleField("textColor", color)}
        labelLocation={labelLocation}
      />
      <ColorPickerInput
        color={defaultOrConfigOrNone("backgroundColor", input, activeConfig)}
        labelText="Background"
        onChange={(color: ArgbHexColor) =>
          updateStyleField("backgroundColor", color)
        }
        labelLocation={labelLocation}
      />
      <ColorPickerInput
        color={defaultOrConfigOrNone("borderColor", input, activeConfig)}
        labelText="Border"
        onChange={(color: ArgbHexColor) =>
          updateStyleField("borderColor", color)
        }
        labelLocation={labelLocation}
      />
      <ColorPickerInput
        color={defaultOrConfigOrNone("menuTextColor", input, activeConfig)}
        labelText="Menu Text Color"
        onChange={(color: ArgbHexColor) =>
          updateStyleField("menuTextColor", color)
        }
        labelLocation={labelLocation}
      />
      <ConfiguredAutoComplete
        options={Object.values(FontType).map((fontType) => ({
          label: fontType,
          value: fontType,
        }))}
        inputLabel="Font Type"
        configurationUpdater={(configuration, macroName, newValue) => {
          console.log("configurationUpdater", configuration, newValue);
          return {
            ...configuration,
            [macroName]: {
              ...configuration[macroName],
              fontType: newValue
                ? fontTypeOrdinal((newValue as Option)?.value as FontType)
                : undefined,
            },
          };
        }}
        getSetting={(configuration) => {
          return configuration?.fontType
            ? {
                label: fontTypeFromOrdinal(configuration.fontType),
                value: fontTypeFromOrdinal(configuration.fontType),
              }
            : undefined;
        }}
        getDefaultValue={(input) => {
          return {
            label: fontTypeFromOrdinal(input?.default?.fontType),
            value: fontTypeFromOrdinal(input?.default?.fontType),
          };
        }}
      />

      <ColorPickerInput
        color={defaultOrConfigOrNone("textAccentColor", input, activeConfig)}
        labelText="Text Accent Color"
        onChange={(color: ArgbHexColor) =>
          updateStyleField("textAccentColor", color)
        }
        labelLocation={labelLocation}
      />

      {/* <Select
        size="small"
        value={defaultOrConfigOrNone("fontType", input, activeConf)}
        
        onChange={(event) =>
          updateStyleField("fontType", event.target.value as FontType)
        }
      >
        <MenuItem value={FontType.NORMAL}>Normal</MenuItem>
        <MenuItem value={FontType.LARGER}>Larger</MenuItem>
        <MenuItem value={FontType.BOLD}>Bold</MenuItem>
      </Select> */}
      {showExamples && (
        <>
          <ItemLabelPreview input={input} itemName={itemName} />
          <ItemMenuPreview input={input} itemName={itemName} />
        </>
      )}
    </div>
  );
};
