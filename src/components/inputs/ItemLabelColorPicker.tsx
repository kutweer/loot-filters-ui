import { useUiStore } from "../../store/store";
import {
  FontType,
  fontTypeFromOrdinal,
  fontTypeOrdinal,
  StyleInput,
  TextAccent,
  textAccentFromOrdinal,
  textAccentOrdinal,
} from "../../types/InputsSpec";
import { UiFilterModule } from "../../types/ModularFilterSpec";
import { ArgbHexColor } from "../../utils/Color";
import { ItemLabelPreview, ItemMenuPreview } from "../Previews";
import { ColorPickerInput } from "./ColorPicker";
import { StyleConfig, StyleConfigKey } from "./StyleInputHelpers";
import { Option, UISelect } from "./UISelect";

export const ItemLabelColorPicker: React.FC<{
  module: UiFilterModule;
  input: StyleInput;
  itemName?: string;
  showExamples?: boolean;
  labelLocation?: "right" | "bottom";
}> = ({
  module,
  input,
  itemName = "Example",
  showExamples = true,
  labelLocation = "bottom",
}) => {
  const activeFilterId = useUiStore((state) =>
    Object.keys(state.importedModularFilters).find(
      (id) => state.importedModularFilters[id].active
    )
  )!!;

  const activeConfig = useUiStore(
    (state) =>
      state.filterConfigurations[activeFilterId][module.id][
        input.macroName
      ] as Partial<StyleConfig>
  );

  const setFilterConfiguration = useUiStore(
    (state) => state.setFilterConfiguration
  );

  const updateStyleField = (
    field: StyleConfigKey,
    value: StyleConfig[StyleConfigKey]
  ) => {
    setFilterConfiguration(activeFilterId, module.id, input.macroName, {
      [field]: value,
    });
  };

  const fontTypeOptions: Option<number>[] = Object.values(FontType).map(
    (type) => ({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: fontTypeOrdinal(type),
    })
  );

  const textAccentOptions: Option<number>[] = Object.values(TextAccent).map(
    (accent) => ({
      label: accent.charAt(0).toUpperCase() + accent.slice(1),
      value: textAccentOrdinal(accent),
    })
  );

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
      <ColorPickerInput
        color={activeConfig?.textColor ?? input.default?.textColor}
        labelText="Text Color"
        onChange={(color?: ArgbHexColor) =>
          updateStyleField("textColor", color)
        }
        labelLocation={labelLocation}
      />
      <ColorPickerInput
        color={activeConfig?.backgroundColor ?? input.default?.backgroundColor}
        labelText="Background"
        onChange={(color?: ArgbHexColor) =>
          updateStyleField("backgroundColor", color)
        }
        labelLocation={labelLocation}
      />
      <ColorPickerInput
        color={activeConfig?.borderColor ?? input.default?.borderColor}
        labelText="Border"
        onChange={(color?: ArgbHexColor) =>
          updateStyleField("borderColor", color)
        }
        labelLocation={labelLocation}
      />

      <UISelect<number>
        options={fontTypeOptions}
        label="Overlay Font Type"
        multiple={false}
        freeSolo={false}
        value={
          activeConfig?.fontType !== undefined
            ? {
                label: fontTypeFromOrdinal(activeConfig.fontType),
                value: activeConfig.fontType,
              }
            : null
        }
        onChange={(newValue) => {
          if (newValue === null) {
            updateStyleField("fontType", undefined);
          } else {
            updateStyleField("fontType", newValue.value);
          }
        }}
      />
      <ColorPickerInput
        color={activeConfig?.menuTextColor ?? input.default?.menuTextColor}
        labelText="Menu Text Color"
        onChange={(color?: ArgbHexColor) =>
          updateStyleField("menuTextColor", color)
        }
        labelLocation={labelLocation}
      />

      <ColorPickerInput
        color={activeConfig?.textAccentColor ?? input.default?.textAccentColor}
        labelText="Text Accent Color"
        onChange={(color?: ArgbHexColor) =>
          updateStyleField("textAccentColor", color)
        }
        labelLocation={labelLocation}
      />

      <UISelect<number>
        options={textAccentOptions}
        label="Text Accent"
        multiple={false}
        freeSolo={false}
        value={
          activeConfig?.textAccent !== undefined
            ? {
                label: textAccentFromOrdinal(activeConfig.textAccent),
                value: activeConfig.textAccent,
              }
            : null
        }
        onChange={(newValue) => {
          if (newValue === null) {
            updateStyleField("textAccent", undefined);
          } else {
            updateStyleField("textAccent", newValue.value);
          }
        }}
      />

      {showExamples && (
        <>
          <ItemLabelPreview module={module} input={input} itemName={itemName} />
          <ItemMenuPreview module={module} input={input} itemName={itemName} />
        </>
      )}
    </div>
  );
};
