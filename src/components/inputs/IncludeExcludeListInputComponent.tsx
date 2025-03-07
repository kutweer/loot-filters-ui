import { Box } from "@mui/material";
import { IncludeExcludeListInput } from "../../types/ModularFilterSpec";
import { StringListInputComponent } from "./BasicInputs";

export const IncludeExcludeListInputComponent: React.FC<{
  input: IncludeExcludeListInput;
}> = ({ input }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <StringListInputComponent
        input={input}
        defaultField="includes"
        label={`${input.label} includes`}
      />
      <StringListInputComponent
        input={input}
        defaultField="excludes"
        label={`${input.label} excludes`}
      />
    </Box>
  );
};
