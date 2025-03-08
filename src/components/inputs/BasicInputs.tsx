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
  FilterId,
  ModularFilterConfiguration,
  readConfigValue,
  UiFilterModule,
} from "../../types/ModularFilterSpec";

export const NumberInputComponent: React.FC<{
  activeFilterId: FilterId;
  module: UiFilterModule;
  input: NumberInput;
}> = ({ activeFilterId, module, input }) => {
  const activeConfig = useUiStore(
    (state) => state.filterConfigurations[activeFilterId]
  );
  const setFilterConfiguration = useUiStore(
    (state) => state.setFilterConfiguration
  );

  const userConfigValue = readConfigValue<number>(
    module.id,
    input.macroName,
    activeConfig
  );
  const currentSetting = userConfigValue ?? input.default;

  return (
    <TextField
      type="number"
      value={currentSetting}
      onChange={(event) => {
        const value = event.target.value;
        setFilterConfiguration(
          activeFilterId,
          module.id,
          input.macroName,
          parseInt(value)
        );
      }}
    />
  );
};

export const EnumInputComponent: React.FC<{
  activeFilterId: FilterId;
  module: UiFilterModule;
  input: EnumListInput;
}> = ({ activeFilterId, module, input }) => {
  const activeConfig = useUiStore(
    (state) => state.filterConfigurations[activeFilterId]
  );
  const setFilterConfiguration = useUiStore(
    (state) => state.setFilterConfiguration
  );

  const currentSetting =
    readConfigValue<string[]>(module.id, input.macroName, activeConfig) ??
    input.default;

  return (
    <Select
      value={currentSetting ?? []}
      onChange={(event) => {
        const value = event.target.value;

        if (Array.isArray(value)) {
          setFilterConfiguration(
            activeFilterId,
            module.id,
            input.macroName,
            value
          );
        } else {
          setFilterConfiguration(activeFilterId, module.id, input.macroName, [
            value.toString(),
          ]);
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
  activeFilterId: FilterId;
  module: UiFilterModule;
  input: BooleanInput;
}> = ({ activeFilterId, module, input }) => {
  const activeConfig: ModularFilterConfiguration = useUiStore(
    (state) => state.filterConfigurations[activeFilterId]
  );
  const setFilterConfiguration = useUiStore(
    (state) => state.setFilterConfiguration
  );

  const currentSetting =
    readConfigValue<boolean>(module.id, input.macroName, activeConfig) ??
    input.default;

  return (
    <Checkbox
      checked={currentSetting}
      onChange={(event) => {
        const value = event.target.checked;
        setFilterConfiguration(
          activeFilterId,
          module.id,
          input.macroName,
          value
        );
      }}
    />
  );
};

export const ListInputComponent: React.FC<{
  activeFilterId: FilterId;
  module: UiFilterModule;
  input: StringListInput | IncludeExcludeListInput | EnumListInput | StyleInput;
  label?: string;
}> = ({ activeFilterId, module, input, label }) => {
  const activeConfig = useUiStore(
    (state) => state.filterConfigurations[activeFilterId]
  );
  const setFilterConfiguration = useUiStore(
    (state) => state.setFilterConfiguration
  );

  return <div>Placeholder input</div>;
};
