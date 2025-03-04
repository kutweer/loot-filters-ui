import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { filter } from "underscore";
import { useLootFilterUiLocalStorage } from "../utils/dataStorage";
import { SiteConfig } from "../utils/devmode";
import { FilterSelector } from "./FilterSelector";
import { CustomizeTab } from "./tabs/CustomizeTab";
import { RenderedFilterTab } from "./tabs/RenderedFilterTab";
export const FilterTabs: React.FC<{
  sha: string;
  siteConfig: SiteConfig;
}> = ({ sha, siteConfig }) => {
  const [activeTab, setActiveTab] = useState(1);

  const [storedData, activeFilter, setStoredData] =
    useLootFilterUiLocalStorage();

  const tabs = [
    {
      label: `${activeFilter.name} Preview`,
      dev: false,
      component: <></>,
    },
    {
      label: `Customize ${activeFilter.name}`,
      dev: false,
      component: (
        <CustomizeTab
          activeFilter={activeFilter}
          storedDataUpdater={setStoredData}
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
          activeFilter={activeFilter}
          storedData={storedData}
          setStoredData={setStoredData}
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
