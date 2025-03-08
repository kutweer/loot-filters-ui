import { useUiStore } from "../../store/store";
import { StyleInput } from "../../types/InputsSpec";
import { UiFilterModule } from "../../types/ModularFilterSpec";
import { ArgbHexColor } from "../../utils/Color";
import { ItemLabelPreview, ItemMenuPreview } from "../Previews";
import { ListInputComponent } from "./BasicInputs";
import { ColorPickerInput } from "./ColorPicker";
import { StyleConfig, StyleConfigKey } from "./StyleInputHelpers";

type Option = {
  label: string;
  value: string;
};

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
      <ColorPickerInput
        color={activeConfig?.menuTextColor ?? input.default?.menuTextColor}
        labelText="Menu Text Color"
        onChange={(color?: ArgbHexColor) =>
          updateStyleField("menuTextColor", color)
        }
        labelLocation={labelLocation}
      />
      <ListInputComponent
        activeFilterId={activeFilterId}
        module={module}
        input={input}
        label="Font Type"
      />

      <ColorPickerInput
        color={activeConfig?.textAccentColor ?? input.default?.textAccentColor}
        labelText="Text Accent Color"
        onChange={(color?: ArgbHexColor) =>
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
          <ItemLabelPreview module={module} input={input} itemName={itemName} />
          <ItemMenuPreview module={module} input={input} itemName={itemName} />
        </>
      )}
    </div>
  );
};
