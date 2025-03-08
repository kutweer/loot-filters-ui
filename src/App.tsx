import { Container } from "@mui/material";
import React from "react";

import { ThemeProvider } from "@mui/material/styles";
import { Header } from "./components/AppHeader";
import { FilterTabs } from "./components/FilterTabs";
import { MuiRsTheme } from "./styles/MuiTheme";
import useSiteConfig from "./utils/devmode";

export const App: React.FC<{ sha: string }> = ({ sha = "main" }) => {
  const [siteConfig, setSiteConfig] = useSiteConfig();
  return (
    <ThemeProvider theme={MuiRsTheme}>
      <Container className="rs-container" maxWidth="lg">
        <Header siteConfig={siteConfig} setSiteConfig={setSiteConfig} />
        <FilterTabs siteConfig={siteConfig} sha={sha} />
      </Container>
    </ThemeProvider>
  );
};

export default App;
