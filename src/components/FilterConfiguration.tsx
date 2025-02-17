import { Box } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import { FilterConfig } from "../templating/filterscape";
import { LootGroupAccordion } from "./LootGroupAccordion";

interface FilterConfigurationProps {
  configuration: FilterConfig;
  setConfiguration: Dispatch<SetStateAction<FilterConfig>>;
}

export const FilterConfiguration: React.FC<FilterConfigurationProps> = ({
  configuration,
  setConfiguration,
}) => {
  return (
    <Box>
      <LootGroupAccordion
        groups={configuration.lootGroups}
        setGroups={(maybeFn) => {
          const newGroups =
            maybeFn instanceof Array
              ? maybeFn
              : maybeFn(configuration.lootGroups);
          setConfiguration({ ...configuration, lootGroups: newGroups });
        }}
      />
    </Box>
  );
};
