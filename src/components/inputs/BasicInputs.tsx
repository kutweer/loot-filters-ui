import { Checkbox, MenuItem, Select, TextField } from "@mui/material";
import { useUiStore } from "../../store/store";
import {
  BooleanInput,
  EnumListInput,
  IncludeExcludeListInput,
  NumberInput,
  StringListInput,
  StyleInput,
} from "../../types/InputsSpec";
import {
  ModularFilterConfiguration,
  readConfigValue,
  UiFilterModule,
} from "../../types/ModularFilterSpec";

export const NumberInputComponent: React.FC<{
  module: UiFilterModule;
  input: NumberInput;
}> = ({ module, input }) => {
  const activeConfig = useUiStore(
    (state) => state.filterConfigurations[module.id]
  );
  const setFilterConfiguration = useUiStore(
    (state) => state.setFilterConfiguration
  );

  const currentSetting = readConfigValue(input, activeConfig) ?? input.default;

  return (
    <TextField
      type="number"
      value={currentSetting}
      onChange={(event) => {
        const value = event.target.value;
        setFilterConfiguration(module.id, {
          [input.macroName]: parseInt(value),
        });
      }}
    />
  );
};

export const EnumInputComponent: React.FC<{
  module: UiFilterModule;
  input: EnumListInput;
}> = ({ module, input }) => {
  const activeConfig = useUiStore(
    (state) => state.filterConfigurations[module.id]
  );
  const setFilterConfiguration = useUiStore(
    (state) => state.setFilterConfiguration
  );

  const currentSetting = readConfigValue(input, activeConfig) ?? input.default;

  return (
    <Select
      value={currentSetting ?? []}
      onChange={(event) => {
        const value = event.target.value;

        if (Array.isArray(value)) {
          setFilterConfiguration(module.id, {
            [input.macroName]: value,
          });
        } else {
          setFilterConfiguration(module.id, {
            [input.macroName]: [value.toString()],
          });
        }
      }}
      displayEmpty
      multiple
      renderValue={(value) => {
        if (Array.isArray(value) && value.length > 0) {
          return value.length > 3
            ? `${value.slice(0, 3).join(", ")}...`
            : value.join(", ");
        }
        return "Select an option";
      }}
    >
      {input.enum.map((enumValue: string, index: number) => (
        <MenuItem key={index} value={enumValue}>
          {enumValue}
        </MenuItem>
      ))}
    </Select>
  );
};

export const BooleanInputComponent: React.FC<{
  module: UiFilterModule;
  input: BooleanInput;
}> = ({ module, input }) => {
  const activeConfig: ModularFilterConfiguration = useUiStore(
    (state) => state.filterConfigurations[module.id]
  );
  const setFilterConfiguration = useUiStore(
    (state) => state.setFilterConfiguration
  );

  const currentSetting = readConfigValue(input, activeConfig) ?? input.default;

  return (
    <Checkbox
      checked={currentSetting}
      onChange={(event) => {
        const value = event.target.checked;
        setFilterConfiguration(module.id, {
          [input.macroName as string]: value,
        });
      }}
    />
  );
};

export const ListInputComponent: React.FC<{
  module: UiFilterModule;
  input: StringListInput | IncludeExcludeListInput | EnumListInput | StyleInput;
  label?: string;
}> = ({ module, input, label }) => {
  const activeConfig = useUiStore(
    (state) => state.filterConfigurations[module.id]
  );
  const setFilterConfiguration = useUiStore(
    (state) => state.setFilterConfiguration
  );

  return <div>Placeholder input</div>;
};
