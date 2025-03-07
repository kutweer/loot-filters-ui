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
import React, { useState } from "react";
import { groupBy } from "underscore";
import {
  FilterModuleProvider,
  useFilterModule,
} from "../../context/FilterModuleContext";
import { colors } from "../../styles/MuiTheme";
import {
  BooleanInput,
  EnumListInput,
  FilterModule,
  FilterModuleInput,
  filterTypes,
  IncludeExcludeListInput,
  NumberInput,
  StringListInput,
  StyleInput,
} from "../../types/ModularFilterSpec";
import useSiteConfig from "../../utils/devmode";
import { ModularFilterConfiguration } from "../../utils/storage";
import { useData } from "../../context/UiDataContext";
import {
  BooleanInputComponent,
  EnumInputComponent,
  NumberInputComponent,
  StringListInputComponent,
} from "../inputs/BasicInputs";
import { DisplayConfigurationInput } from "../inputs/DisplayConfigurationInput";
import { IncludeExcludeListInputComponent } from "../inputs/IncludeExcludeListInputComponent";
import { ItemLabelPreview } from "../Previews";

const InputComponent: React.FC = () => {
  const { input } = useFilterModule();

  switch (input.type) {
    case "number":
      const numberInput = input as NumberInput;
      return <NumberInputComponent input={numberInput} />;
    case "boolean":
      return <BooleanInputComponent input={input as BooleanInput} />;
    case "enumlist":
      const enumListInput = input as EnumListInput;
      return <EnumInputComponent input={enumListInput} />;
    case "stringlist":
      return <StringListInputComponent input={input as StringListInput} />;
    case "style":
      return <DisplayConfigurationInput input={input as StyleInput} />;
    default:
      return (
        <IncludeExcludeListInputComponent
          input={input as IncludeExcludeListInput}
        />
      );
  }
};

const sizeOf = (input: FilterModuleInput<keyof typeof filterTypes>) => {
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
  activeFilterConfiguration: ModularFilterConfiguration<
    keyof typeof filterTypes
  >;
}> = ({ module, activeFilterConfiguration }) => {
  const styleInputs = module.inputs.filter((input) => input.type === "style");

  return (
    <Stack direction="row" spacing={2}>
      {styleInputs.slice(0, 4).map((input) => (
        <FilterModuleProvider key={input.macroName.toString()} input={input}>
          <ItemLabelPreview
            key={input.macroName.toString()}
            itemName={input.label}
          />
        </FilterModuleProvider>
      ))}
    </Stack>
  );
};

const ModuleSection: React.FC<{
  module: FilterModule;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}> = ({ module, expanded, setExpanded }) => {
  const { getActiveFilterConfiguration } = useData();

  const activeFilterConfiguration = getActiveFilterConfiguration();

  const defaultGroupId = crypto.randomUUID();
  const groupedInputs = groupBy(
    module.inputs.map((input) => ({
      ...input,
      group: input.group ?? defaultGroupId,
    })),
    "group",
  );

  return (
    <Accordion
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
          <FirstCoupleLabels
            module={module}
            activeFilterConfiguration={activeFilterConfiguration}
          />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2} direction="column">
          {Object.entries(groupedInputs).map(([group, inputs], index) => {
            return (
              <Grid2 container spacing={2} key={group}>
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
                  .sort((a, b) => sizeOf(a) - sizeOf(b))
                  .map((input) => {
                    return (
                      <Grid2
                        key={input.macroName.toString()}
                        size={sizeOf(input)}
                      >
                        <Typography variant="h6" color="primary">
                          {input.label} {sizeOf(input)}
                        </Typography>
                        <FilterModuleProvider input={input}>
                          <InputComponent />
                        </FilterModuleProvider>
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

  const { getActiveFilter } = useData();

  const activeFilter = getActiveFilter();

  const [siteConfig, _] = useSiteConfig();

  if (!activeFilter) {
    return (
      <Typography variant="h4" color="primary">
        No filter selected
      </Typography>
    );
  }

  console.log("customizetab, activeFilter", activeFilter);

  return (
    <Stack spacing={2}>
      {activeFilter?.modules.map((module) => (
        <ModuleSection
          key={module.name}
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
