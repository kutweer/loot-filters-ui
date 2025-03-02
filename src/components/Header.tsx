import { DeleteOutline } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  createFilterOptions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { colors } from "../styles/MuiTheme";
import { FilterConfig } from "../types/FilterTypes";
import { LootFilterUiData } from "../utils/dataStorage";
import useSiteConfig, { SiteConfig } from "../utils/devmode";

const filter = createFilterOptions<LootFilterConfigOption>();

type LootFilterConfigOption = {
  label: string;
  inputValue?: string;
  active?: boolean;
  sourceFilter?: string;
  newItem?: boolean;
};

export const Header: React.FC<{
  data: LootFilterUiData;
  filterConfigs: LootFilterConfigOption[];
  setOrCreateNewActiveConfig: (
    config: LootFilterConfigOption & { sourceConfig?: FilterConfig }
  ) => void;
  deleteConfig: (config: LootFilterConfigOption) => void;
  siteConfig: SiteConfig;
  setSiteConfig: (config: SiteConfig) => void;
}> = ({ data, deleteConfig, filterConfigs, setOrCreateNewActiveConfig, siteConfig, setSiteConfig }) => {
  const activeConfig = filterConfigs.find((c) => c.active);
  const [value, setValue] = useState<LootFilterConfigOption | null>(
    activeConfig ?? filterConfigs[0]
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newFilterName, setNewFilterName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (value != null) {
      setOrCreateNewActiveConfig(value);
    }
  }, [value]);

  const handleCreateNewFilter = (inputValue: string) => {
    setNewFilterName(inputValue);
    setDialogOpen(true);
  };

  const handleCopyFilter = (sourceName: string) => {
    const sourceConfig = data.configs.find(
      (group) => group.name === sourceName
    );

    setOrCreateNewActiveConfig({
      label: newFilterName,
      sourceConfig: sourceConfig,
    });
    setDialogOpen(false);
  };

  const handleCreateEmpty = () => {
    setOrCreateNewActiveConfig({
      label: newFilterName,
    });
    setDialogOpen(false);
  };

  const handleDelete = (option: LootFilterConfigOption) => {
    setValue(filterConfigs.find((c) => c.label !== option.label) ?? null);
    deleteConfig(option);
    setDeleteDialogOpen(false);
  };

  return (
    <Box>
      <Box
        sx={{
          padding: 1,
          display: "flex",
        }}
      >
        <Typography variant="h4" color="primary">
          Loot Filter Builder
          <Typography
            sx={{ paddingLeft: "1em", display: "inline-block" }}
            gutterBottom
          >
            <span style={{ color: colors.rsYellow }}>
              A Loot Filter builder for{" "}
              <Link
                style={{
                  color: colors.rsYellow,
                  textDecorationColor: colors.rsYellow,
                }}
                target="_blank"
                href="https://github.com/riktenx/loot-filters"
              >
                RuneLite Loot Filters
              </Link>
            </span>
          </Typography>
        </Typography>
        {siteConfig.isLocal ? (
          <FormControl sx={{ marginLeft: "auto" }}>
            <FormGroup>
              <FormControlLabel
                sx={{ color: colors.rsYellow }}
                control={<Switch checked={siteConfig.devMode} />}
                onChange={(_, checked: boolean) =>
                  setSiteConfig({ ...siteConfig, devMode: checked })
                }
                label="Dev Mode"
              />
            </FormGroup>
          </FormControl>
        ) : null}
      </Box>
    </Box>
  );
};
