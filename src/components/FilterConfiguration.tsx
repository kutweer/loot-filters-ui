import React, { Dispatch, SetStateAction, useState } from 'react';
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
    configuration: FilterConfig;
    setConfiguration: Dispatch<SetStateAction<FilterConfig>>
}

export const FilterConfiguration: React.FC<FilterConfigurationProps> = ({
    configuration,
    setConfiguration
}) => {

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Filter Settings
            </Typography>
            <LootGroupAccordion
                groups={configuration.lootGroups}
                setGroups={(maybeFn) => {
                    const newGroups = maybeFn instanceof Array ? maybeFn : maybeFn(configuration.lootGroups)
                    setConfiguration({ ...configuration, lootGroups: newGroups })
                }}
            />
        </Box>
    );
}; 