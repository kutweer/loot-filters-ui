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
import { useData } from "../../context/UiDataContext";
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
import {
  BooleanInputComponent,
  EnumInputComponent,
  NumberInputComponent,
  StringListInputComponent,
} from "../inputs/BasicInputs";
import { DisplayConfigurationInput } from "../inputs/DisplayConfigurationInput";
import { IncludeExcludeListInputComponent } from "../inputs/IncludeExcludeListInputComponent";
import { ItemLabelPreview } from "../Previews";
import { InputProvider, useInput } from "../../context/InputContext";

const InputComponent: React.FC = () => {
  const { input } = useInput();

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
    case "includeExcludeList":
      return (
        <IncludeExcludeListInputComponent
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
}> = ({ module }) => {
  const styleInputs: StyleInput[] = module.inputs.filter(
    (input) => input.type === "style"
  ) as StyleInput[];

  return (
    <Stack direction="row" spacing={2}>
      {styleInputs.slice(0, 4).map((input) => (
        <ItemLabelPreview
          key={input.macroName.toString()}
          itemName={input.label}
          input={input}
        />
      ))}
    </Stack>
  );
};

const ModuleSection: React.FC<{
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}> = ({ expanded, setExpanded }) => {
  const { module } = useFilterModule();

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
                  .map((input, index) => {
                    return (
                      <InputProvider key={index} input={input}>
                        <Grid2 key={index} size={sizeOf(input)}>
                          <Typography variant="h6" color="primary">
                            {input.label}
                          </Typography>
                          <InputComponent />
                        </Grid2>
                      </InputProvider>
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

  return (
    <Stack spacing={2}>
      {activeFilter?.modules.map((module: FilterModule, index: number) => (
        <FilterModuleProvider
          key={module.name}
          activeFilterId={activeFilter.id}
          module={module}
        >
          <ModuleSection
            key={index}
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
        </FilterModuleProvider>
      ))}
    </Stack>
  );
};
