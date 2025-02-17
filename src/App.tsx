import React, { useState } from 'react';
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
import { FilterConfig } from './templating/filterscape';
import { FilterConfiguration } from './components/FilterConfiguration';


export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [configuration, setConfiguration] = useState<FilterConfig | null> (null)

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
              <Tab label="Filter Editor" />
            </Tabs>
          </Box>


          <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
            <FilterConfiguration configuration={configuration} setConfiguration={setConfiguration} />
          </Box>

          <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
            <Editor height='300px' defaultLanguage='c++' value={'//foo'} />
          </Box>

        </Paper>
      </Box>
    </Container>
  );
};

export default App; 