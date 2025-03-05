import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { filter } from "underscore";
import { loadConfigs, storeConfigs, StoredData } from "../utils/dataStorage";
import { SiteConfig } from "../utils/devmode";
import { FilterSelector } from "./FilterSelector";
import { CustomizeTab } from "./tabs/CustomizeTab";
export const FilterTabs: React.FC<{
  sha: string;
  siteConfig: SiteConfig;
}> = ({ sha, siteConfig }) => {
  console.log("FilterTabs rendered");
  const [activeTab, setActiveTab] = useState(1);

  const [storedData, setStoredData] = useState<StoredData>(loadConfigs());
  useEffect(() => {
    storeConfigs(storedData);
  }, [storedData]);

  const activeFilter =
    storedData.selectedFilterIndex >= 0
      ? storedData.filters[storedData.selectedFilterIndex]
      : null;

  console.log("FilterTabs activeFilter", activeFilter);
  console.log("FilterTabs storedData", storedData);

  const tabs = [
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
          activeFilter={activeFilter!!}
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
        <FilterSelector storedData={storedData} setStoredData={setStoredData} />
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
