import { Container } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Header } from "./components/AppHeader";
import { FilterTabs } from "./components/FilterTabs";
import { MuiRsTheme } from "./styles/MuiTheme";

export const App = ({ sha = "main" }: { sha?: string }) => {
  return (
    <ThemeProvider theme={MuiRsTheme}>
      <Container className="rs-container" maxWidth="lg">
        <Header />
        <FilterTabs sha={sha} />
      </Container>
    </ThemeProvider>
  );
};

export default App;
