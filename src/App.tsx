import { Editor } from "@monaco-editor/react";
import {
  Box,
  Container,
  Link,
  Tab,
  Tabs,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DEFAULT_CONFIG } from "./filterscape/Filterscape";
import { renderFilter } from "./templating/RenderFilters";
import { FilterConfig, LootGroup } from "./types/FilterTypes";
import useSiteConfig from "./utils/devmode";
import { LootGroupList } from "./v2-components/LootGroupList";

import { createTheme, ThemeProvider } from '@mui/material/styles';

const LOOT_FILTER_CONFIG_KEY = "loot-filter-config";

const colors = {
  rsYellow: "#ffff00",
  rsOrange: "#ff9300",
  rsDarkBrown: "#2c2721",
  rsLightDarkBrown: "#3d3429",
  rsLightBrown: "#564e43",
  rsMediumBrown: "#4a4036",
  rsWhite: "#ffffff",
  rsBlack: "#000000",
}

const theme = createTheme({
  mixins: {
    toolbar: {
      fontFamily: "RuneScape",
    }
  },
  palette: {
    primary: {
      main: colors.rsOrange,
      contrastText: colors.rsWhite
    },
    secondary: {
      main: colors.rsWhite,
      contrastText: colors.rsYellow,
    },
    background: {
      default: colors.rsDarkBrown,
      paper: colors.rsLightDarkBrown,
    },
    divider: colors.rsWhite,
    text: {
      primary: colors.rsOrange,
      secondary: colors.rsLightBrown,
      disabled: "#cccccc",
    },
    common: {
      black: colors.rsBlack,
      white: colors.rsWhite,
    },
    mode: "dark",
  },

});

export const App: React.FC<{ sha: string }> = ({ sha = "main" }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [siteConfig, setSiteConfig] = useSiteConfig();
  const [configuration, setConfiguration] = useState<FilterConfig>(
    JSON.parse(
      siteConfig.devMode ? JSON.stringify(DEFAULT_CONFIG) :
        localStorage.getItem(LOOT_FILTER_CONFIG_KEY) ||
        JSON.stringify(DEFAULT_CONFIG),
    ),
  );

  if (!siteConfig.devMode) {
    useEffect(() => {
      console.log('hi');
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
    <ThemeProvider theme={theme}>
      <Container className="rs-container" maxWidth="lg">
        <Box className="rs-header">
          <Box sx={{ padding: 1, display: "flex", justifyContent: "space-between" }}>
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
                  <span className="rs-yellow-text">
                    Development Mode
                  </span>
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
              <LootGroupList
                groups={configuration.lootGroups}
                handleGroupUpdate={(groups: LootGroup[]) => {
                  setConfiguration((config: FilterConfig) => {
                    return { ...config, lootGroups: groups };
                  });
                }}
                handleCreateGroup={handleCreateGroup}
              />
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
    </ThemeProvider>
  );
};

export default App;
