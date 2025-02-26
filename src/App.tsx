import { Editor } from "@monaco-editor/react";
import { Box, Container, Link, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DEFAULT_CONFIG } from "./filterscape/Filterscape";
import { renderFilter } from "./templating/RenderFilters";
import { FilterConfig, LootGroup } from "./types/FilterTypes";
import useSiteConfig from "./utils/devmode";
import { LootGroupList } from "./components/LootGroupList";

import { ThemeProvider } from "@mui/material/styles";
import { MuiRsTheme } from "./styles/MuiTheme";

const LOOT_FILTER_CONFIG_KEY = "loot-filter-config";

export const App: React.FC<{ sha: string }> = ({ sha = "main" }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [siteConfig, setSiteConfig] = useSiteConfig();
  const [configuration, setConfiguration] = useState<FilterConfig>(
    JSON.parse(
      siteConfig.devMode
        ? JSON.stringify(DEFAULT_CONFIG)
        : localStorage.getItem(LOOT_FILTER_CONFIG_KEY) ||
        JSON.stringify(DEFAULT_CONFIG),
    ),
  );

  if (!siteConfig.devMode) {
    useEffect(() => {
      localStorage.setItem(
        LOOT_FILTER_CONFIG_KEY,
        JSON.stringify(configuration),
      );
    }, [configuration]);
  }

  const handleCreateGroup = (newGroup: LootGroup) => {
    setConfiguration((config: FilterConfig) => {
      const groups = [newGroup, ...config.lootGroups];
      return { ...configuration, lootGroups: groups };
    });
  };

  return (
    <ThemeProvider theme={MuiRsTheme}>
      <Container className="rs-container" maxWidth="lg">
        <Box>
          <Box
            sx={{
              padding: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" color="primary">
              Loot Filter Builder
              <Typography
                sx={{ paddingLeft: "1em", display: "inline-block" }}
                gutterBottom
                variant="caption"
              >
                {siteConfig.devMode ? (
                  <span className="rs-yellow-text">Development Mode</span>
                ) : (
                  <span className="rs-yellow-text">
                    A Loot Filter builder for
                    <Link
                      target="_blank"
                      href="https://github.com/riktenx/loot-filters"
                    >
                      RuneLite Loot Filters
                    </Link>
                  </span>
                )}
              </Typography>
            </Typography>
          </Box>

          <Box sx={{ mt: 3, p: 2, borderRadius: 5 }}>
            <Box sx={{ borderBottom: 1, mb: 2 }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                aria-label="filter tabs"
              >
                <Tab label="Filter Settings" />
                <Tab label="Rendered Filter" />
              </Tabs>
            </Box>

            <Box sx={{ display: activeTab === 0 ? "block" : "none" }}>
              <LootGroupList
                groups={configuration.lootGroups}
                handleGroupUpdate={setConfiguration}
                handleCreateGroup={handleCreateGroup}
              />
            </Box>

            <Box sx={{ display: activeTab === 1 ? "block" : "none" }}>
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
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
