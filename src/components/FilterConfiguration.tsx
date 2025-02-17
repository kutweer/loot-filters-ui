import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FilterConfig, LootGroup } from '../templating/filterscape';
import { LootGroupAccordion } from './LootGroupAccordion';

interface FilterConfigurationProps {
  configuration: FilterConfig | null;
  setConfiguration: (config: FilterConfig | null) => void;
}

export const FilterConfiguration: React.FC<FilterConfigurationProps> = ({
  configuration,
  setConfiguration
}) => {
    const [groups, setGroups] = useState<LootGroup[]>()

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Filter Settings
      </Typography>


      <LootGroupAccordion groups={groups} setGroups={setGroups} />      
    </Box>
  );
}; 