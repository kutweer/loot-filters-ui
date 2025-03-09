import { useUiStore } from "../../store/store";
import { StringListInput } from "../../types/InputsSpec";
import { FilterId, UiFilterModule } from "../../types/ModularFilterSpec";
import { Option, UISelect } from "./UISelect";

export const StringListInputComponent: React.FC<{
  activeFilterId: FilterId;
  module: UiFilterModule;
  input: StringListInput;
}> = ({ activeFilterId, module, input }) => {
  const setFilterConfiguration = useUiStore(
    (state) => state.setFilterConfiguration,
  );

  const activeConfig = useUiStore(
    (state) => state.filterConfigurations[activeFilterId],
  );

  const currentValues =
    (activeConfig?.[module.id]?.[input.macroName] as string[] | undefined) ??
    input.default;

  const options: Option[] = input.default.map((option: string) => ({
    label: option,
    value: option,
  }));

  return (
    <UISelect
      options={options}
      label={input.label}
      multiple={true}
      freeSolo={true}
      value={currentValues.map((value: string) => ({
        label: value,
        value: value,
      }))}
      onChange={(newValue) => {
        const values = ((newValue as Option[]) || []).map(
          (option) => option.value,
        );
        setFilterConfiguration(
          activeFilterId,
          module.id,
          input.macroName,
          values,
        );
      }}
    />
  );
};
