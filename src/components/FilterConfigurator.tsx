import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { filter } from "underscore";
import { useLootFilterUiLocalStorage } from "../utils/dataStorage";
import { SiteConfig } from "../utils/devmode";
import { FilterSelector } from "./FilterSelector";
import InputDevelopmentTab from "./tabs/InputDevelopmentTab";
import { RenderedFilterTab } from "./tabs/RenderedFilterTab";

export const FilterConfigurator: React.FC<{
  sha: string;
  siteConfig: SiteConfig;
}> = ({ sha, siteConfig }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: "Filter Preview",
      dev: false,
      component: (
        <Typography variant="h1" color="text.secondary">
          Filter Preview
        </Typography>
      ),
    },
    {
      label: "Customize Filter",
      dev: false,
      component: (
        <Typography variant="h1" color="text.secondary">
          Filter Preview
        </Typography>
      ),
    },
    {
      label: "Rendered Filter",
      dev: true,
      component: <RenderedFilterTab sha={sha} />,
    },
    {
      label: "Input Development",
      dev: true,
      component: <InputDevelopmentTab />,
    },
  ];

  const filteredTabs = filter(
    tabs,
    (tab) => siteConfig.devMode || tab.dev === false
  );

  const [lootFilterUiData, setLootFilterUiData] = useLootFilterUiLocalStorage();

  return (
    <Box sx={{ mt: 3, p: 2, borderRadius: 5 }}>
      <Box>
        <FilterSelector
          lootFilterUiData={lootFilterUiData}
          setLootFilterUiData={setLootFilterUiData}
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
      {filteredTabs[activeTab].component}
    </Box>
  );
};
