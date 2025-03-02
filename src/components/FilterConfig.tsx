import { Editor } from "@monaco-editor/react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import InputDevelopmentTab from "../tabs/InputDevelopmentTab";
import { renderFilter } from "../templating/RenderFilters";
import { FilterConfig, LootGroup } from "../types/FilterTypes";
import { SiteConfig } from "../utils/devmode";
import { LootGroupList } from "./LootGroupList";

export const FilterConfigComponent: React.FC<{
  configuration: FilterConfig;
  setConfiguration: (updater: (prev: FilterConfig) => FilterConfig) => void;
  sha: string;
  siteConfig: SiteConfig;
}> = ({ configuration, setConfiguration, sha, siteConfig }) => {
  const [activeTab, setActiveTab] = useState(0);
  const handleCreateGroup = (newGroup: LootGroup) => {
    setConfiguration((config: FilterConfig) => {
      const groups = [newGroup, ...config.lootGroups];
      return { ...configuration, lootGroups: groups };
    });
  };

  return (
    <Box sx={{ mt: 3, p: 2, borderRadius: 5 }}>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        aria-label="filter tabs"
      >
        <Tab
          sx={{
            fontSize: "1.2rem",
          }}
          label="Filter Preview"
        />
        <Tab
          sx={{
            fontSize: "1.2rem",
          }}
          label="Customize Filter"
        />
        <Tab
          sx={{
            fontSize: "1.2rem",
            display: siteConfig.devMode ? "block" : "none",
          }}
          label="Old Filter Input"
        />
        <Tab
          sx={{
            fontSize: "1.2rem",
            display: siteConfig.devMode ? "block" : "none",
          }}
          label="Rendered Filter"
        />
        <Tab
          sx={{
            fontSize: "1.2rem",
            display: siteConfig.devMode ? "block" : "none",
          }}
          label="Input Development"
        />
      </Tabs>
      <Box role="tabpanel" hidden={activeTab !== 0}>
        <Typography variant="h1" color="text.secondary">
          Filter Preview
        </Typography>
      </Box>

      <Box role="tabpanel" hidden={activeTab !== 1}>
        <Typography variant="h1" color="text.secondary">
          Customize Filter
        </Typography>
      </Box>

      <Box role="tabpanel" hidden={activeTab !== 2}>
        <LootGroupList
          groups={configuration.lootGroups}
          handleGroupUpdate={setConfiguration}
          handleCreateGroup={handleCreateGroup}
        />
      </Box>
      <Box role="tabpanel" hidden={activeTab !== 3}>
        <Typography color="text.secondary">
          Copy and paste it for now.
        </Typography>
        <Editor
          height="70vh"
          language="cpp"
          theme="vs-dark"
          options={{
            minimap: {
              enabled: false,
            },
            readOnly: true,
          }}
          value={renderFilter(configuration, sha)}
        />
      </Box>

      <Box role="tabpanel" hidden={activeTab !== 4}>
        <InputDevelopmentTab />
      </Box>
    </Box>
  );
};
