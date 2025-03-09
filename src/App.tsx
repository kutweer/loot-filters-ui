import { Container } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Header } from "./components/AppHeader";
import { FilterTabs } from "./components/FilterTabs";
import { MuiRsTheme } from "./styles/MuiTheme";

export const App = ({ sha = "main" }: { sha?: string }) => {
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
