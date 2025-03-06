import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { filter } from "underscore";
import { SiteConfig } from "../utils/devmode";
import { useData } from "../utils/storage";
import { FilterSelector } from "./FilterSelector";
import { CustomizeTab } from "./tabs/CustomizeTab";
export const FilterTabs: React.FC<{
  sha: string;
  siteConfig: SiteConfig;
}> = ({ sha, siteConfig }) => {
  const [activeTab, setActiveTab] = useState(1);

  const dataContext = useData();

  const {
    data: { activeFilterId, importedModularFilters, filterConfigurations },
    setActiveFilters,
    setNewImportedModularFilter,
    setFilterConfiguration,
    setFilterConfigurationRemoved,
    setModularFilterRemoved,
  } = dataContext;

  const activeFilter = activeFilterId
    ? importedModularFilters[activeFilterId]
    : undefined;

  const activeFilterConfiguration = activeFilter
    ? filterConfigurations[activeFilter.id]
    : undefined;

  const tabs: {
    label: string;
    dev: boolean;
    component: React.ReactNode;
    disabled?: boolean;
  }[] = [
    {
      label: `${activeFilter?.name || "Filter"} Preview`,
      dev: false,
      component: <></>,
    },
    {
      label: `Customize ${activeFilter?.name}`,
      disabled: activeFilter === null,
      dev: false,
      component: (
        <CustomizeTab
          activeFilterId={activeFilterId!!}
          activeFilter={activeFilter!!}
          activeFilterConfiguration={activeFilterConfiguration!!}
          dataContext={dataContext}
        />
      ),
    },
    // {
    //   label: "Rendered Filter",
    //   dev: true,
    //   component: <RenderedFilterTab sha={sha} />,
    // },
  ];

  const filteredTabs = filter(
    tabs,
    (tab) => siteConfig.devMode || tab.dev === false
  );

  return (
    <Box sx={{ mt: 3, p: 2, borderRadius: 5 }}>
      <Box>
        <FilterSelector
          activeFilterId={activeFilterId}
          activeFilter={activeFilter}
          activeConfiguration={activeFilterConfiguration}
          importedModularFilters={importedModularFilters}
          setActiveFilters={setActiveFilters}
          setNewImportedModularFilter={setNewImportedModularFilter}
          setFilterConfiguration={setFilterConfiguration}
          setFilterConfigurationRemoved={setFilterConfigurationRemoved}
          setModularFilterRemoved={setModularFilterRemoved}
        />
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
