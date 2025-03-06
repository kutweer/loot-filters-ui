import { ModularFilterConfiguration } from "../../utils/storage";
import { IncludeExcludeListInput } from "../../types/ModularFilterSpec";
import { DataContext } from "../../utils/storage";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { StringListInputComponent } from "./BasicInputs";

export const IncludeExcludeListInputComponent: React.FC<{
  input: IncludeExcludeListInput;
  activeFilterConfiguration: ModularFilterConfiguration<"includeExcludeList">;
  activeFilterId: string;
  dataContext: DataContext;
}> = ({ input, activeFilterConfiguration, activeFilterId, dataContext }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <StringListInputComponent
        input={input}
        activeFilterConfiguration={activeFilterConfiguration}
        activeFilterId={activeFilterId}
        dataContext={dataContext}
        defaultField="includes"
      />
      <StringListInputComponent
        input={input}
        activeFilterConfiguration={activeFilterConfiguration}
        activeFilterId={activeFilterId}
        dataContext={dataContext}
        defaultField="excludes"
      />
    </Box>
  );
};
