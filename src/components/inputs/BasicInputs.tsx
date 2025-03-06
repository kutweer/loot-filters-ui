import {
  Autocomplete,
  Checkbox,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { isNumber } from "underscore";
import {
  BooleanInput,
  EnumListInput,
  IncludeExcludeListInput,
  IncludeExcludeListInputDefaults,
  NumberInput,
  StringListInput,
} from "../../types/ModularFilterSpec";
import { DataContext, ModularFilterConfiguration } from "../../utils/storage";

export const NumberInputComponent: React.FC<{
  input: NumberInput;
  activeFilterConfiguration: ModularFilterConfiguration<"number">;
  activeFilterId: string;
  dataContext: DataContext;
}> = ({ input, activeFilterConfiguration, activeFilterId, dataContext }) => {
  const currentSetting =
    activeFilterConfiguration?.[input.macroName as string] ?? input.default;

  return (
    <TextField
      type="number"
      value={currentSetting}
      onChange={(event) => {
        const value = event.target.value;
        dataContext.setFilterConfiguration(activeFilterId, {
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
  activeFilterConfiguration: ModularFilterConfiguration<"enumlist">;
  activeFilterId: string;
  dataContext: DataContext;
}> = ({ input, activeFilterConfiguration, activeFilterId, dataContext }) => {
  const currentValue =
    activeFilterConfiguration?.[input.macroName as string] ?? input.default;

  return (
    <Select
      value={currentValue ?? []}
      onChange={(event) => {
        dataContext.setFilterConfiguration(activeFilterId, {
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
  activeFilterConfiguration: ModularFilterConfiguration<"boolean">;
  activeFilterId: string;
  dataContext: DataContext;
}> = ({ input, activeFilterConfiguration, activeFilterId, dataContext }) => {
  const currentValue =
    activeFilterConfiguration?.[input.macroName as string] ?? input.default;
  return (
    <Checkbox
      checked={currentValue}
      onChange={(event) => {
        const value = event.target.checked;
        dataContext.setFilterConfiguration(activeFilterId, {
          [input.macroName as string]: value,
        });
      }}
    />
  );
};

export const StringListInputComponent: React.FC<{
  input: StringListInput | IncludeExcludeListInput;
  defaultField?: "includes" | "excludes";
  activeFilterConfiguration: ModularFilterConfiguration<
    "stringlist" | "includeExcludeList"
  >;
  activeFilterId: string;
  dataContext: DataContext;
}> = ({
  input,
  defaultField,
  activeFilterConfiguration,
  activeFilterId,
  dataContext,
}) => {
  const macroName =
    input.type === "includeExcludeList"
      ? (input.macroName as { includes: string; excludes: string })[
          defaultField!!
        ]
      : (input.macroName as string);

  const currentValues =
    activeFilterConfiguration?.[macroName] ??
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
        console.log(newValue);
        if (typeof newValue === "string") {
          dataContext.setFilterConfiguration(activeFilterId, {
            [macroName as string]: [{ value: newValue, label: newValue }],
          });
        }

        if (newValue && (newValue as any)?.inputValue) {
          dataContext.setFilterConfiguration(activeFilterId, {
            [macroName as string]: newValue,
          });
        } else {
          dataContext.setFilterConfiguration(activeFilterId, {
            [macroName as string]: newValue,
          });
        }
      }}
      filterOptions={(options, params) => {
        console.log("render input", params, options);
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
      renderInput={(params) => <TextField {...params} label={input.label} />}
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
        const isNewValue = !currentValues.some(
          (value: { value: string }) => value.value === option.value
        );

        const selectText = isNewValue
          ? `Add "${option.inputValue}"`
          : option.label;
        return (
          <li key={key} {...optionProps}>
            {option.label || `Add "${option.inputValue}"`}
          </li>
        );
      }}
    />
  );
};
