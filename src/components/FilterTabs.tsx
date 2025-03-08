import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { filter } from "underscore";
import { useUiStore } from "../store/store";
import { SiteConfig } from "../utils/devmode";
import { FilterSelector } from "./FilterSelector";
import { CustomizeTab } from "./tabs/CustomizeTab";
import { RenderedFilterTab } from "./tabs/RenderedFilterTab";

export const FilterTabs: React.FC<{
  sha: string;
  siteConfig: SiteConfig;
}> = ({ sha, siteConfig }) => {
  const [activeTab, setActiveTab] = useState(0);

  const importedModularFilters = useUiStore(
    (state) => state.importedModularFilters
  );
  const activeFilter = useMemo(
    () => Object.values(importedModularFilters).find((filter) => filter.active),
    [importedModularFilters]
  );

  const tabs = useMemo(() => {
    return [
      {
        label: `Customize ${activeFilter?.name ?? "Filter"}`,
        disabled: !activeFilter,
        dev: false,
        component: activeFilter ? <CustomizeTab /> : <Typography variant="h6" color="secondary">No filter selected, select or import a filter</Typography>,
      },
      {
        label: `${activeFilter?.name || "Filter"} Preview`,
        disabled: !activeFilter,
        dev: false,
        component: <RenderedFilterTab sha={sha} />,
      },
    ];
  }, [activeFilter]);

  const filteredTabs = useMemo(
    () => filter(tabs, (tab) => siteConfig.devMode || tab.dev === false),
    [tabs, siteConfig.devMode]
  );

  return (
    <Box sx={{ mt: 3, p: 2, borderRadius: 5 }}>
      <Box>
        <FilterSelector />
      </Box>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        aria-label="filter tabs"
      >
        {filteredTabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            disabled={tab.disabled}
            sx={{
              fontSize: "1.2rem",
            }}
          />
        ))}
      </Tabs>
      <Box sx={{ mt: 2 }}>{filteredTabs[activeTab].component}</Box>
    </Box>
  );
};
