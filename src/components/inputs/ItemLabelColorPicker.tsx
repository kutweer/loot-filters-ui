import { useUiStore } from "../../store/store";
import { StyleInput } from "../../types/InputsSpec";
import {
  ModularFilterConfiguration,
  UiFilterModule,
} from "../../types/ModularFilterSpec";
import { ArgbHexColor } from "../../utils/Color";
import { ItemLabelPreview, ItemMenuPreview } from "../Previews";
import { ListInputComponent } from "./BasicInputs";
import { ColorPickerInput } from "./ColorPicker";
import {
  defaultOrConfigOrNone,
  StyleConfig,
  StyleConfigKey,
} from "./StyleInputHelprs";

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
  const activeConfig: ModularFilterConfiguration = useUiStore(
    (state) => state.filterConfigurations[module.id]
  );

  const setFilterConfiguration = useUiStore(
    (state) => state.setFilterConfiguration
  );

  const updateStyleField = (
    field: StyleConfigKey,
    value: StyleConfig[StyleConfigKey]
  ) => {
    const update = { [field]: value } as Partial<StyleConfig>;
    const full = { ...activeConfig, [input.macroName]: update };
    setFilterConfiguration(module.id, full);
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
      <ListInputComponent module={module} input={input} label="Font Type" />

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
