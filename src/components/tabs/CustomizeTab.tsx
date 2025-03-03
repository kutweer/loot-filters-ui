import { Paper, Stack, Typography } from "@mui/material";
import { Filter, StoredDataUpdater, updateOneFilter } from "../../utils/dataStorage";
import { Rs2fModuleComponent } from "../inputs/Rs2fModuleComponent";

export const CustomizeTab: React.FC<{
  activeFilter: Filter;
  storedDataUpdater: StoredDataUpdater;
}> = ({ activeFilter, storedDataUpdater }) => {
  return (
    <Stack spacing={2} direction="column">
      {activeFilter.modules.map((module, index) => (
        <Paper elevation={3} sx={{ p: 2, pl: 4, pr: 4 }} key={index}>
          <Rs2fModuleComponent
            module={module}
            onChange={(module) =>
              updateOneFilter(storedDataUpdater, activeFilter.name, (prevFilter) => ({
                ...prevFilter,
                modules: prevFilter.modules.map((m) =>
                  m.name === module.name ? module : m
                ),
              }))
            }
          />
        </Paper>
      ))}
    </Stack>
  );
};
