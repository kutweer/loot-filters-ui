import { Editor } from "@monaco-editor/react";
import {
  Box,
  Container,
  Link,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DEFAULT_CONFIG } from "./filterscape/Filterscape";
import { renderFilter } from "./templating/RenderFilters";
import { FilterConfig, LootGroup } from "./types/FilterTypes";
import useSiteConfig from "./utils/devmode";
import { LootGroupComponent } from "./v2-components/LootGroup";

const LOOT_FILTER_CONFIG_KEY = "loot-filter-config";

export const App: React.FC<{ sha: string }> = ({ sha = "main" }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [siteConfig, setSiteConfig] = useSiteConfig();
  const [configuration, setConfiguration] = useState<FilterConfig>(
    JSON.parse(
      // localStorage.getItem(LOOT_FILTER_CONFIG_KEY) ||
      JSON.stringify(DEFAULT_CONFIG),
    ),
  );

  const [expanded, setExpanded] = useState<string[]>([]);

  if (!siteConfig.devMode) {
    useEffect(() => {
      localStorage.setItem(
        LOOT_FILTER_CONFIG_KEY,
        JSON.stringify(configuration),
      );
    }, [configuration]);
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography
          style={{ fontFamily: "RuneScape" }}
          variant="h4"
          gutterBottom
        >
          Loot Filter Builder
          <Typography
            sx={{ paddingLeft: "1em", display: "inline-block" }}
            gutterBottom
            variant="caption"
          >
            {siteConfig.devMode ? (
              "Development Mode"
            ) : (
              <span>
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

        <Box sx={{ mt: 3, p: 2, background: "#f0f0f0", borderRadius: 5 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
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
            <Stack direction="column" spacing={2}>
              {configuration.lootGroups.map((group, index) => (
                <LootGroupComponent
                  key={index}
                  group={group}
                  onChange={(updatedGroup: LootGroup) => {
                    setConfiguration((config: FilterConfig) => {
                      const groups = [...config.lootGroups];
                      groups[index] = updatedGroup;
                      console.log(updatedGroup);
                      return { ...configuration, lootGroups: groups };
                    });
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Box sx={{ display: activeTab === 1 ? "block" : "none" }}>
            <Typography>Copy and paste it for now.</Typography>
            <Editor
              height="70vh"
              language="cpp"
              value={renderFilter(configuration, sha)}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default App;
