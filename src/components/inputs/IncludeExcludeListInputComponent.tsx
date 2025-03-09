import { Box } from "@mui/material";
import { useUiStore } from "../../store/store";
import { IncludeExcludeListInput } from "../../types/InputsSpec";
import { FilterId, UiFilterModule } from "../../types/ModularFilterSpec";
import { Option, UISelect } from "./UISelect";

export const IncludeExcludeListInputComponent: React.FC<{
  activeFilterId: FilterId;
  module: UiFilterModule;
  input: IncludeExcludeListInput;
}> = ({ activeFilterId, module, input }) => {
  const setFilterConfiguration = useUiStore(
    (state) => state.setFilterConfiguration,
  );

  const activeConfig = useUiStore(
    (state) => state.filterConfigurations[activeFilterId],
  );

  const currentIncludes =
    (activeConfig?.[module.id]?.[input.macroName.includes] as
      | string[]
      | undefined) ?? input.default.includes;
  const currentExcludes =
    (activeConfig?.[module.id]?.[input.macroName.excludes] as
      | string[]
      | undefined) ?? input.default.excludes;

  const includeOptions: Option[] = input.default.includes.map(
    (option: string) => ({
      label: option,
      value: option,
    }),
  );

  const excludeOptions: Option[] = input.default.excludes.map(
    (option: string) => ({
      label: option,
      value: option,
    }),
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <UISelect
        options={includeOptions}
        label={`${input.label} includes`}
        multiple={true}
        freeSolo={true}
        value={currentIncludes.map((include: string) => ({
          label: include,
          value: include,
        }))}
        onChange={(newValue) => {
          const includes = ((newValue as Option[]) || []).map(
            (option) => option.value,
          );
          setFilterConfiguration(
            activeFilterId,
            module.id,
            input.macroName.includes,
            includes,
          );
        }}
      />
      <UISelect
        options={excludeOptions}
        label={`${input.label} excludes`}
        multiple={true}
        freeSolo={true}
        value={currentExcludes.map((exclude: string) => ({
          label: exclude,
          value: exclude,
        }))}
        onChange={(newValue) => {
          const excludes = ((newValue as Option[]) || []).map(
            (option) => option.value,
          );
          setFilterConfiguration(
            activeFilterId,
            module.id,
            input.macroName.excludes,
            excludes,
          );
        }}
      />
    </Box>
  );
};
