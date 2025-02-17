import { Editor } from "@monaco-editor/react";
import { Box, Container, Link, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FilterConfiguration } from "./components/FilterConfiguration";
import {
  DEFAULT_CONFIG,
  FilterConfig,
  renderFilter,
} from "./templating/filterscape";

const LOOT_FILTER_CONFIG_KEY = "loot-filter-config";

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [configuration, setConfiguration] = useState<FilterConfig>(
    JSON.parse(
      // localStorage.getItem(LOOT_FILTER_CONFIG_KEY) ||
        JSON.stringify(DEFAULT_CONFIG),
    ),
  );

  // if (window.location.hostname !== "localhost") {
  //   useEffect(() => {
  //     localStorage.setItem(
  //       LOOT_FILTER_CONFIG_KEY,
  //       JSON.stringify(configuration),
  //     );
  //   }, [configuration]);
  // }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Loot Filter Builder
          <Typography
            sx={{ paddingLeft: "1em", display: "inline-block" }}
            variant="subtitle1"
            gutterBottom
          >
            A Loot Filter builder for{" "}
            <Link
              target="_blank"
              href="https://github.com/riktenx/loot-filters"
            >
              RuneLite Loot Filters
            </Link>
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
            <FilterConfiguration
              configuration={configuration}
              setConfiguration={setConfiguration}
            />
          </Box>

          <Box sx={{ display: activeTab === 1 ? "block" : "none" }}>
            <Typography>Copy and paste it for now.</Typography>
            <Editor
              height="70vh"
              language="cpp"
              value={renderFilter(configuration)}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default App;
