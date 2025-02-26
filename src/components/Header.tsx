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
  InputLabel,
  Link,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { colors } from "../styles/MuiTheme";
import { FilterConfig } from "../types/FilterTypes";
import { LootFilterUiData } from "../utils/dataStorage";

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
    config: LootFilterConfigOption & { sourceConfig?: FilterConfig },
  ) => void;
  deleteConfig: (config: LootFilterConfigOption) => void;
}> = ({ data, deleteConfig, filterConfigs, setOrCreateNewActiveConfig }) => {
  const activeConfig = filterConfigs.find((c) => c.active);
  const [value, setValue] = useState<LootFilterConfigOption | null>(
    activeConfig ?? filterConfigs[0],
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
      (group) => group.name === sourceName,
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
        <Box sx={{ marginLeft: "auto" }}>
          <Button
            variant="outlined"
            color="error"
            disabled={filterConfigs.length === 1}
            size="small"
            sx={{ marginTop: "15px", marginLeft: "auto", marginRight: "10px" }}
            onClick={() => {
              if (value != null) {
                setDeleteDialogOpen(true);
              }
            }}
          >
            Delete
            <DeleteOutline />
          </Button>
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Delete Filter?</DialogTitle>
            <DialogContent>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  if (value != null) {
                    handleDelete(value);
                  }
                }}
              >
                Delete
              </Button>
            </DialogContent>
          </Dialog>
        </Box>
        <Autocomplete
          sx={{ width: 300, marginLeft: "10px" }}
          freeSolo={true}
          value={value}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              handleCreateNewFilter(newValue);
            } else if (newValue && newValue.newItem && newValue.inputValue) {
              handleCreateNewFilter(newValue.inputValue);
            } else {
              setValue(newValue);
            }
          }}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === "string") {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue;
            }
            // Regular option
            return option.label;
          }}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;

            return (
              <li key={key} {...optionProps}>
                {option.label}
              </li>
            );
          }}
          getOptionDisabled={(option) => {
            return option.active ?? false;
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some(
              (option) => inputValue === option.label,
            );
            if (inputValue !== "" && !isExisting) {
              filtered.push({
                inputValue,
                newItem: true,
                label: `Add "${inputValue}"`,
              });
            }

            return filtered;
          }}
          options={filterConfigs}
          renderInput={(params) => (
            <div>
              <InputLabel
                id="config-select-label"
                sx={{ color: colors.rsOrange }}
              >
                Config Select
              </InputLabel>
              <TextField
                variant="standard"
                slotProps={{ inputLabel: { id: "config-select-label" } }}
                {...params}
              />
            </div>
          )}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle sx={{ color: colors.rsYellow }}>
          Create New Filter
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2, color: "grey" }}>
            Choose a filter to copy or start with an empty filter
          </Typography>
          <List>
            {filterConfigs.map((config) => (
              <ListItemButton
                key={config.label}
                onClick={() => handleCopyFilter(config.label)}
              >
                <ListItemText primary={`Copy from: ${config.label}`} />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateEmpty}>Create Empty Filter</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
