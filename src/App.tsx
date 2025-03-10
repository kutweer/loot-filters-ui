import { Container } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Header } from "./components/AppHeader";
import { FilterTabs } from "./components/FilterTabs";
import { MuiRsTheme } from "./styles/MuiTheme";
import { useUiStore } from "./store/store";

export const App = ({ sha = "main" }: { sha?: string }) => {
  const setSiteConfig = useUiStore((state) => state.setSiteConfig);
  const params = new URLSearchParams(window.location.search);
  const devMode = params.get("dev") === "true";

  if (devMode) {
    setSiteConfig({ devMode });
  }

  return (
    <ThemeProvider theme={MuiRsTheme}>
      <span style={{ display: "none", fontFamily: "RuneScape" }}>
        runescape
      </span>
      <span style={{ display: "none", fontFamily: "RuneScapeBold" }}>
        RuneScapeBold
      </span>
      <span style={{ display: "none", fontFamily: "RuneScapeSmall" }}>
        RuneScapeSmall
      </span>
      <Container className="rs-container" maxWidth="xl">
        <Header />
        <FilterTabs sha={sha} />
      </Container>
    </ThemeProvider>
  );
};

export default App;
