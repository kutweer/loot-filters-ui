import { Box } from "@mui/material";
import { IncludeExcludeListInput } from "../../types/InputsSpec";
import { UiFilterModule } from "../../types/ModularFilterSpec";
import { ListInputComponent } from "./BasicInputs";

export const IncludeExcludeListInputComponent: React.FC<{
  module: UiFilterModule;
  input: IncludeExcludeListInput;
}> = ({ module, input }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <ListInputComponent
        module={module}
        input={input}
        defaultField="includes"
        label={`${input.label} includes`}
      />
      <ListInputComponent
        module={module}
        input={input}
        defaultField="excludes"
        label={`${input.label} excludes`}
      />
    </Box>
  );
};
