import React, { SetStateAction, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Link,
  Tabs,
  Tab
} from '@mui/material';
import { Editor } from '@monaco-editor/react';
import { DEFAULT_CONFIG, FilterConfig, renderFilter } from './templating/filterscape';
import { FilterConfiguration } from './components/FilterConfiguration';

const LOOT_FILTER_CONFIG_KEY = "loot-filter-config"

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [configuration, setConfiguration] = useState<FilterConfig>(
    JSON.parse(localStorage.getItem(LOOT_FILTER_CONFIG_KEY) || JSON.stringify(DEFAULT_CONFIG))
  )

  if (window.location.hostname !== 'localhost') {
    useEffect(() => {
      localStorage.setItem(LOOT_FILTER_CONFIG_KEY, JSON.stringify(configuration))
    }, [configuration])
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Loot Filter UI
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          A Loot Filter editor for <Link target="_blank" href="https://github.com/riktenx/loot-filters">RuneLite Loot Filters</Link>
        </Typography>

        <Paper sx={{ mt: 3, p: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} aria-label="filter tabs">
              <Tab label="Configuration" />
              <Tab label="Rendered Filter" />
            </Tabs>
          </Box>


          <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
            <FilterConfiguration configuration={configuration} setConfiguration={setConfiguration} />
          </Box>

          <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
            <Editor height='300px' language='cpp' value={
              renderFilter(configuration)
            } />
          </Box>

        </Paper>
      </Box>
    </Container>
  );
};

export default App; 