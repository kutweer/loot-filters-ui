import { Container, Typography } from "@mui/material";
import React from "react";

import { ThemeProvider } from "@mui/material/styles";
import { FilterConfigComponent } from "./components/FilterConfig";
import { Header } from "./components/Header";
import { MuiRsTheme } from "./styles/MuiTheme";
import { LootFilterUiData, useStoredConfigs } from "./utils/dataStorage";


export const App: React.FC<{ sha: string }> = ({ sha = "main" }) => {
  const [storedConfigs, setStoredConfigs] = useStoredConfigs();


  return (
    <ThemeProvider theme={MuiRsTheme}>
      <Container className="rs-container" maxWidth="lg">
        <Header
          deleteConfig={(config) => {
            setStoredConfigs((prev: LootFilterUiData) => {
              console.log('deleting', config);
              const newConfigs = prev.configs.filter((c) => c.name !== config.label);
              return { ...prev, configs: newConfigs };
            });
          }}
          data={storedConfigs}
          filterConfigs={storedConfigs.configs.map((config) => ({
            label: config.name,
            inputValue: config.name,
            active: config.active
          }))}
          setOrCreateNewActiveConfig={(config) => {
            const name = config.label;

            setStoredConfigs((prev: LootFilterUiData) => {
              // update active state of all configs
              const configs = [...prev.configs.map((c) => ({
                ...c,
                active: c.name === name
              }))];

              // if no active config, create a new one with the given name
              if (configs.find((c) => c.active) == null) {
                console.log('creating with', config);
                const newConfig = {
                  lootGroups: [],
                  includePreamble: true,
                  active: true,
                  ...(config.sourceConfig ? { ...config.sourceConfig } : {}),
                  name,
                }
                console.log('newConfig', newConfig);
                configs.push(newConfig);
              }

              return { ...prev, configs };
            });

          }}
        />
        {
          storedConfigs.configs.find((c) => c.active) != null ?
            <FilterConfigComponent
              setConfiguration={(updater) => {
                setStoredConfigs(
                  (prev: LootFilterUiData) => {
                    const activeConfig = prev.configs.find((c) => c.active)!!;
                    const configs = prev.configs.map((c) => (c.name === activeConfig.name ? updater(c) : c));
                    return { ...prev, configs };
                  });
              }}
              sha={sha}
              configuration={storedConfigs.configs.find((c) => c.active)!!} />
            : <Typography>No active config</Typography>
        }
      </Container>
    </ThemeProvider >
  );
};

export default App;
