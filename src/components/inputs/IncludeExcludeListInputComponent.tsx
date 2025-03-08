import { Box } from "@mui/material";
import { IncludeExcludeListInput } from "../../types/InputsSpec";
import { FilterId, UiFilterModule } from "../../types/ModularFilterSpec";
import { ListInputComponent } from "./BasicInputs";

export const IncludeExcludeListInputComponent: React.FC<{
  activeFilterId: FilterId;
  module: UiFilterModule;
  input: IncludeExcludeListInput;
}> = ({ activeFilterId, module, input }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <ListInputComponent
        activeFilterId={activeFilterId}
        module={module}
        input={input}
        label={`${input.label} includes`}
      />
      <ListInputComponent
        activeFilterId={activeFilterId}
        module={module}
        input={input}
        label={`${input.label} excludes`}
      />
    </Box>
  );
};
