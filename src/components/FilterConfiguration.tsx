import { Box } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import { LootGroupAccordion } from "./LootGroupAccordion";
import { FilterConfig } from "../types/FilterTypes";
import { ItemGroupMappingAccordion } from "./ItemGroupMappingAccordion";

interface FilterConfigurationProps {
  configuration: FilterConfig;
  setConfiguration: Dispatch<SetStateAction<FilterConfig>>;
}

export const FilterConfiguration: React.FC<FilterConfigurationProps> = ({
  configuration,
  setConfiguration,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
      <ItemGroupMappingAccordion
        mappings={configuration.itemGroupMappings}
        setMappings={(maybeFn) => {
          const newMappings =
            maybeFn instanceof Array
              ? maybeFn
              : maybeFn(configuration.itemGroupMappings);
          setConfiguration({
            ...configuration,
            itemGroupMappings: newMappings,
          });
        }}
        lootGroups={configuration.lootGroups.map((group) => group.name)}
      />
    </Box>
  );
};
