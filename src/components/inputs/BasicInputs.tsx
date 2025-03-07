import {
  Autocomplete,
  Checkbox,
  createFilterOptions,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { isNumber } from "underscore";
import { useFilterModule } from "../../context/FilterModuleContext";
import {
  BooleanInput,
  EnumListInput,
  FilterModuleInput,
  filterTypes,
  IncludeExcludeListInput,
  IncludeExcludeListInputDefaults,
  NumberInput,
  StringListInput,
} from "../../types/ModularFilterSpec";
import { ModularFilterConfiguration, useData } from "../../utils/storage";
export const NumberInputComponent: React.FC<{
  input: NumberInput;
}> = ({ input }) => {
  const {
    getActiveFilterConfiguration,
    updateConfigurationForActiveFilter: setConfigurationForActiveFilter,
  } = useData();

  const activeConfiguration = getActiveFilterConfiguration();
  const currentSetting =
    activeConfiguration?.[input.macroName as string] ?? input.default;

  return (
    <TextField
      type="number"
      value={currentSetting}
      onChange={(event) => {
        const value = event.target.value;
        setConfigurationForActiveFilter({
          [input.macroName as string]: isNumber(parseInt(value))
            ? parseInt(value)
            : value,
        });
      }}
    />
  );
};

export const EnumInputComponent: React.FC<{
  input: EnumListInput;
}> = ({ input }) => {
  const {
    getActiveFilterConfiguration,
    updateConfigurationForActiveFilter: setConfigurationForActiveFilter,
  } = useData();

  const activeConfiguration = getActiveFilterConfiguration();
  const currentSetting =
    activeConfiguration?.[input.macroName as string] ?? input.default;

  return (
    <Select
      value={currentSetting ?? []}
      onChange={(event) => {
        setConfigurationForActiveFilter({
          [input.macroName as string]: Array.isArray(event.target.value)
            ? event.target.value
            : [event.target.value],
        });
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
  input: BooleanInput;
}> = ({ input }) => {
  const { getActiveFilterConfiguration, updateConfigurationForActiveFilter } =
    useData();

  const activeConfiguration = getActiveFilterConfiguration();
  const currentSetting =
    activeConfiguration?.[input.macroName as string] ?? input.default;
  return (
    <Checkbox
      checked={currentSetting}
      onChange={(event) => {
        const value = event.target.checked;
        updateConfigurationForActiveFilter({
          [input.macroName as string]: value,
        });
      }}
    />
  );
};

export const StringListInputComponent: React.FC<{
  input: StringListInput | IncludeExcludeListInput;
  defaultField?: "includes" | "excludes";
  label?: string;
}> = ({ input, defaultField, label }) => {
  const { getActiveFilterConfiguration, updateConfigurationForActiveFilter } =
    useData();

  const activeConfiguration = getActiveFilterConfiguration();

  const macroName =
    input.type === "includeExcludeList"
      ? (input.macroName as { includes: string; excludes: string })[
          defaultField!!
        ]
      : (input.macroName as string);

  const currentValues =
    activeConfiguration?.[macroName] ??
    (input.type === "includeExcludeList"
      ? (input.default as IncludeExcludeListInputDefaults)[defaultField!!]
      : input.default);

  const options = currentValues.map(
    (value: string | { label: string; value: string }) => {
      if (typeof value === "string") {
        return {
          label: value,
          value,
        };
      }
      return value;
    }
  );

  return (
    <Autocomplete
      multiple
      freeSolo
      value={currentValues}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          updateConfigurationForActiveFilter({
            [macroName as string]: [{ value: newValue, label: newValue }],
          });
        }

        if (newValue && (newValue as any)?.inputValue) {
          updateConfigurationForActiveFilter({
            [macroName as string]: newValue,
          });
        } else {
          updateConfigurationForActiveFilter({
            [macroName as string]: newValue,
          });
        }
      }}
      filterOptions={(options, params) => {
        const newOptions = [...options];
        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.label
        );
        if (inputValue !== "" && !isExisting) {
          newOptions.push({
            inputValue,
            value: inputValue,
          });
        }

        return newOptions;
      }}
      renderInput={(params) => (
        <TextField {...params} label={label || input.label} />
      )}
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.label;
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;

        return (
          <li key={key} {...optionProps}>
            {option.label || `Add "${option.inputValue}"`}
          </li>
        );
      }}
    />
  );
};

export type Option = {
  label: string;
  value: string;
  inputValue?: string;
};

export interface ConfiguredAutoCompleteProps<
  Multiple extends boolean | undefined = false,
> {
  multiple?: Multiple;
  options: Option[];
  inputLabel: string;
  configurationUpdater: <T extends keyof typeof filterTypes>(
    configuration: ModularFilterConfiguration<T>,
    newValue: Option[] | Option | undefined
  ) => ModularFilterConfiguration<T>;

  getSetting: <T extends keyof typeof filterTypes>(
    configuration: ModularFilterConfiguration<T>
  ) => Multiple extends true ? Option[] : Option | undefined;

  getDefaultValue: <T extends keyof typeof filterTypes>(
    input: FilterModuleInput<T>
  ) => Multiple extends true
    ? Option[] | Option | undefined
    : Option | undefined;

  allowCreate?: boolean;
}
/**
 *
 * It is up to the caller to convert between the Option type and whatever
 * the serialized // saved type is.
 */
export const ConfiguredAutoComplete: React.FC<ConfiguredAutoCompleteProps> = ({
  options,
  inputLabel,
  configurationUpdater,
  getSetting,
  getDefaultValue,
  allowCreate = false,
  multiple = false,
}) => {
  const { getActiveFilterConfiguration, updateConfigurationForActiveFilter } =
    useData();
  const activeConfiguration = getActiveFilterConfiguration();
  console.log("activeConfiguration", activeConfiguration);
  const { input } = useFilterModule();

  const currentSetting = getSetting(activeConfiguration);
  const inputDefault = getDefaultValue(input);
  const currentSelectedOptions = currentSetting ?? inputDefault;

  const filter = createFilterOptions<Option>();

  const computeAndSetNewConfig = (newValue: Option[] | Option | undefined) => {
    const updatedConfig = configurationUpdater(activeConfiguration, newValue);
    updateConfigurationForActiveFilter(updatedConfig);
  };

  return (
    <Autocomplete
      multiple={multiple}
      freeSolo={allowCreate}
      value={currentSelectedOptions}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          configurationUpdater(
            activeConfiguration,
            multiple
              ? [{ label: newValue, value: newValue }]
              : { label: newValue, value: newValue }
          );
          return;
        }

        if (Array.isArray(newValue)) {
          const updatedConfig: Option[] = newValue.map((value) => {
            if (typeof value === "string") {
              return { label: value, value };
            }
            return value;
          });
          computeAndSetNewConfig(updatedConfig);
          return;
        }

        if (newValue && newValue?.inputValue) {
          computeAndSetNewConfig({
            label: newValue.inputValue,
            value: newValue.inputValue,
          });
        } else if (newValue) {
          computeAndSetNewConfig(newValue);
        } else {
          computeAndSetNewConfig(undefined);
        }
      }}
      filterOptions={(options, params) => {
        const newOptions = [...options];
        const { inputValue } = params;

        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.label
        );

        if (inputValue !== "" && !isExisting) {
          newOptions.push({
            label: inputValue,
            value: inputValue,
          });
        }

        return newOptions;
      }}
      renderInput={(params) => <TextField {...params} label={inputLabel} />}
      options={options}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }

        if (option?.label === undefined) {
          console.log("option", option);
          return "Select an option";
        }
        // Regular option
        return option.label;
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        const isNewValue = !options.some(
          (value: { value: string }) => value.value === option.value
        );

        return (
          <li key={key} {...optionProps}>
            {option.label || `Add "${option.inputValue}"`}
          </li>
        );
      }}
    />
  );
};
