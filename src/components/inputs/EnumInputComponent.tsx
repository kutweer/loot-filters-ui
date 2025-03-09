import { useUiStore } from "../../store/store";
import { EnumListInput } from "../../types/InputsSpec";
import { FilterId, UiFilterModule } from "../../types/ModularFilterSpec";
import { Option, UISelect } from "./UISelect";

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

  const currentSetting: string[] =
    (activeConfig?.[module.id]?.[input.macroName] as string[]) ?? input.default;

  const options: Option<string>[] = input.enum.map((enumValue) => {
    if (typeof enumValue === "string") {
      return {
        label: enumValue,
        value: enumValue,
      };
    }
    return enumValue;
  });

  const selectedOptions = Array.isArray(currentSetting)
    ? currentSetting
        .filter((value): value is string => typeof value === "string")
        .map((value) => {
          const found = options.find((o) => o.value === value);
          if (found) {
            return found;
          }
          return {
            label: value,
            value: value,
          };
        })
    : [];

  return (
    <UISelect<string>
      options={options}
      value={selectedOptions}
      onChange={(newValue: Option<string>[] | null) => {
        setFilterConfiguration(
          activeFilterId,
          module.id,
          input.macroName,
          newValue ? newValue.map((option) => option.value) : []
        );
      }}
      multiple
      label="Select options"
    />
  );
};
