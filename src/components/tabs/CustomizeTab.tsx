import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { groupBy } from "underscore";
import { useUiStore } from "../../store/store";
import { colors } from "../../styles/MuiTheme";

import {
  BooleanInput,
  EnumListInput,
  FilterType,
  IncludeExcludeListInput,
  Input,
  NumberInput,
  StringListInput,
  StyleInput,
} from "../../types/InputsSpec";
import { FilterModule, UiFilterModule } from "../../types/ModularFilterSpec";
import useSiteConfig from "../../utils/devmode";
import {
  BooleanInputComponent,
  EnumInputComponent,
  ListInputComponent,
  NumberInputComponent,
} from "../inputs/BasicInputs";
import { DisplayConfigurationInput } from "../inputs/DisplayConfigurationInput";
import { IncludeExcludeListInputComponent } from "../inputs/IncludeExcludeListInputComponent";
import { ItemLabelPreview } from "../Previews";
const InputComponent: React.FC<{
  module: UiFilterModule;
  input: Input;
}> = ({ module, input }) => {
  switch (input.type as FilterType) {
    case "number":
      const numberInput = input as NumberInput;
      return <NumberInputComponent input={numberInput} module={module} />;
    case "boolean":
      return (
        <BooleanInputComponent module={module} input={input as BooleanInput} />
      );
    case "enumlist":
      const enumListInput = input as EnumListInput;
      return <EnumInputComponent module={module} input={enumListInput} />;
    case "stringlist":
      return (
        <ListInputComponent module={module} input={input as StringListInput} />
      );
    case "style":
      return (
        <DisplayConfigurationInput
          module={module}
          input={input as StyleInput}
        />
      );
    case "includeExcludeList":
      return (
        <IncludeExcludeListInputComponent
          module={module}
          input={input as IncludeExcludeListInput}
        />
      );
    default:
      return (
        <Typography variant="h6" color="primary">
          {`placeholder: ${input.type}`}
        </Typography>
      );
  }
};

const sizeOf = (input: Input) => {
  switch (input.type) {
    case "number":
      return 4;
    case "boolean":
      return 2;
    case "style":
      return 12;
    case "includeExcludeList":
      return 12;
    default:
      return 4;
  }
};

const FirstCoupleLabels: React.FC<{
  module: FilterModule;
}> = ({ module }) => {
  const styleInputs: StyleInput[] = module.inputs.filter(
    (input) => input.type === "style"
  ) as StyleInput[];

  return (
    <Stack direction="row" spacing={2}>
      {styleInputs.slice(0, 4).map((input) => {
        const macroName = (input as StyleInput).macroName;
        return (
          <ItemLabelPreview
            key={macroName}
            itemName={input.label}
            input={input}
          />
        );
      })}
    </Stack>
  );
};

const ModuleSection: React.FC<{
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  module: UiFilterModule;
}> = ({ expanded, setExpanded, module }) => {
  const defaultGroupId = crypto.randomUUID();
  const groupedInputs = groupBy(
    module.inputs.map((input) => ({
      ...input,
      group: input.group ?? defaultGroupId,
    })),
    "group"
  );

  return (
    <Accordion
      slotProps={{ transition: { unmountOnExit: true } }}
      expanded={expanded}
      sx={{
        "&::before": {
          backgroundColor: colors.rsDarkBrown,
        },
      }}
    >
      <AccordionSummary
        onClick={() => setExpanded(!expanded)}
        expandIcon={<ExpandMore />}
      >
        <Typography variant="h4" color="primary">
          Module: {module.name}
        </Typography>
        <Stack direction="row" spacing={2}>
          <FirstCoupleLabels module={module} />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2} direction="column">
          {Object.entries(groupedInputs).map(([group, inputs], index) => {
            return (
              <Grid2 key={index} container spacing={2}>
                <Grid2 size={12}>
                  <Divider>
                    {group !== defaultGroupId ? (
                      <Typography variant="h6" color="primary">
                        {group}
                      </Typography>
                    ) : null}
                  </Divider>
                </Grid2>
                {inputs
                  .sort((a: Input, b: Input) => sizeOf(a) - sizeOf(b))
                  .map((input, index) => {
                    return (
                      <Grid2 key={index} size={sizeOf(input)}>
                        <Typography variant="h6" color="primary">
                          {input.label}
                        </Typography>
                        <InputComponent module={module} input={input} />
                      </Grid2>
                    );
                  })}
              </Grid2>
            );
          })}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export const CustomizeTab: React.FC = () => {
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});
  const [siteConfig, _] = useSiteConfig();
  const importedModularFilters = useUiStore(
    (state) => state.importedModularFilters
  );
  const activeFilter = useMemo(
    () => Object.values(importedModularFilters).find((filter) => filter.active),
    [importedModularFilters]
  );

  if (!activeFilter) {
    return (
      <Typography variant="h4" color="primary">
        No filter selected
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {activeFilter?.modules.map((module, index: number) => (
        <ModuleSection
          key={index}
          module={module}
          expanded={
            expandedModules[module.name] ?? (false || siteConfig.devMode)
          }
          setExpanded={(expanded) =>
            setExpandedModules((prev) => ({
              ...prev,
              [module.name]: expanded,
            }))
          }
        />
      ))}
    </Stack>
  );
};
