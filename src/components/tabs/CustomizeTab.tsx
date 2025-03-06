import {
  Box,
  Checkbox,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { groupBy } from "underscore";
import {
  BooleanInput,
  EnumListInput,
  FilterModule,
  FilterModuleInput,
  filterTypes,
  ModularFilter,
  NumberInput,
  StringListInput,
  StyleInput,
} from "../../types/ModularFilterSpec";
import {
  DataContext,
  ModularFilterConfiguration,
  ModularFilterConfigurationId,
  ModularFilterId,
} from "../../utils/storage";
import { DisplayConfigurationInput } from "../inputs/DisplayConfigurationInput";
import { BooleanInputComponent, EnumInputComponent, NumberInputComponent, StringListInputComponent } from "../inputs/BasicInputs";

const getInputComponent = (
  input: FilterModuleInput<keyof typeof filterTypes>,
  activeFilterId: ModularFilterId,
  activeFilterConfiguration: ModularFilterConfiguration<
    keyof typeof filterTypes
  >,
  dataContext: DataContext
): React.ReactNode => {
  switch (input.type) {
    case "number":
      const numberInput = input as NumberInput;
       return (
        <NumberInputComponent
          input={numberInput}
          activeFilterConfiguration={activeFilterConfiguration}
          activeFilterId={activeFilterId}
          dataContext={dataContext}
        />
      );
    case "boolean":
      return (
        <BooleanInputComponent
          input={input as BooleanInput}
          activeFilterConfiguration={activeFilterConfiguration}
          activeFilterId={activeFilterId}
          dataContext={dataContext}
        />
      );
    case "enumlist":
      const enumListInput = input as EnumListInput;
      return (
        <EnumInputComponent
          input={enumListInput}
          activeFilterConfiguration={activeFilterConfiguration}
          activeFilterId={activeFilterId}
          dataContext={dataContext}
        />
      );
    case "stringlist":
      return (
        <StringListInputComponent
          input={input as StringListInput}
          activeFilterConfiguration={activeFilterConfiguration}
          activeFilterId={activeFilterId}
          dataContext={dataContext}
        />
      );
    case "style":
      return (
        <DisplayConfigurationInput
          input={input as StyleInput}
          dataContext={dataContext}
        />
      );
    default:
      return null;
  }
};

const ModuleSection: React.FC<{
  module: FilterModule;
  activeFilterId: ModularFilterId;
  activeFilterConfiguration: ModularFilterConfiguration<
    keyof typeof filterTypes
  >;
  dataContext: DataContext;
}> = ({
  module,
  activeFilterId,
  activeFilterConfiguration,
  dataContext,
}) => {
  const defaultGroupId = crypto.randomUUID();
  const groupedInputs = groupBy(
    module.inputs.map((input) => ({
      ...input,
      group: input.group ?? defaultGroupId,
    })),
    "group"
  );

  return (
    <Paper elevation={3} sx={{ p: 2, pl: 4, pr: 4 }}>
      <Typography variant="h4" color="primary">
        Module: {module.name}
      </Typography>
      <Stack spacing={2} direction="column">
        {Object.entries(groupedInputs).map(([group, inputs]) => {
          return (
            <Box key={group}>
              {group !== defaultGroupId && (
                <Typography variant="h6" color="primary">
                  {group}
                </Typography>
              )}
              {inputs.map((input) => {
                return (
                  <Box key={input.macroName.toString()}>
                    <Typography variant="h6" color="primary">
                      {input.label}
                    </Typography>
                    {getInputComponent(
                      input,
                      activeFilterId,
                      activeFilterConfiguration,
                      dataContext
                    )}
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
};

export const CustomizeTab: React.FC<{
  activeFilter: ModularFilter;
  activeFilterId: ModularFilterId;
  activeFilterConfiguration: ModularFilterConfiguration<
    keyof typeof filterTypes
  >;
  dataContext: DataContext;
}> = ({
  activeFilter,
  activeFilterId,
  activeFilterConfiguration,
  dataContext,
}) => {
  if (!activeFilter) {
    return (
      <Stack spacing={2} direction="column">
        <Typography>No filter selected</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={2} direction="column">
      {activeFilter.modules.map((module, index) => (
        <ModuleSection
          key={index}
          module={module}
          activeFilterId={activeFilterId}
          activeFilterConfiguration={activeFilterConfiguration}
          dataContext={dataContext}
        />
      ))}
    </Stack>
  );
};
