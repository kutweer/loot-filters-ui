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
  const { getActiveFilter, getActiveFilterConfiguration } = useData();

  const activeFilter = getActiveFilter();
  const activeFilterConfiguration = getActiveFilterConfiguration();

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
      component: activeFilter ? <CustomizeTab /> : null,
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
