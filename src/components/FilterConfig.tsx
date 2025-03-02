import { Editor } from "@monaco-editor/react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import InputDevelopmentTab from "../tabs/InputDevelopmentTab";
import { SiteConfig } from "../utils/devmode";
import { filter } from "underscore";
import { RenderedFilterTab } from "../tabs/RenderedFilterTab";

export const FilterConfigComponent: React.FC<{
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

  return (
    <Box sx={{ mt: 3, p: 2, borderRadius: 5 }}>
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
