import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useUiStore } from "../store/store";
import { FilterId } from "../types/ModularFilterSpec";
import useSiteConfig from "../utils/devmode";
import { loadFilter } from "../utils/modularFilterLoader";

const COMMON_FILTERS = [
  {
    name: "FilterScape - An all in one filter for mains",
    url: "https://raw.githubusercontent.com/riktenx/filterscape/refs/heads/main/index.json",
  },
  {
    name: "Typical Whack's Loot Filter for Persnickity Irons",
    url: "https://raw.githubusercontent.com/typical-whack/loot-filters-modules/refs/heads/main/filter.json",
  },
];

const DEV_FILTERS = [
  {
    name: "Style Input Test",
    url: "https://raw.githubusercontent.com/Kaqemeex/example-configurable-filter/refs/heads/main/single_style_filter.json",
  },
  {
    name: "Misc Filter",
    url: "https://raw.githubusercontent.com/Kaqemeex/example-configurable-filter/refs/heads/main/misc_filter.json",
  },
  {
    name: "Invalid Input Filter",
    url: "https://raw.githubusercontent.com/Kaqemeex/example-configurable-filter/refs/heads/main/filter_with_invalid_input.json",
  },
];

export const FilterSelector: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [filterUrl, setFilterUrl] = useState("");
  const [siteConfig, _] = useSiteConfig();

  const filtersForImport = [
    ...(siteConfig.devMode ? DEV_FILTERS : []),
    ...COMMON_FILTERS,
  ];

  const importedModularFilters = useUiStore(
    (state) => state.importedModularFilters
  );
  const addImportedModularFilter = useUiStore(
    (state) => state.addImportedModularFilter
  );
  const setActiveFilterId = useUiStore((state) => state.setActiveFilterId);

  const activeFilter = useMemo(
    () => Object.values(importedModularFilters).find((filter) => filter.active),
    [importedModularFilters]
  );
  const removeImportedModularFilter = useUiStore(
    (state) => state.removeImportedModularFilter
  );

  const handleFilterChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      setActiveFilterId(e.target.value as FilterId);
    },
    [setActiveFilterId]
  );

  const handleDeleteFilter = useCallback(() => {
    if (activeFilter) {
      setActiveFilterId(activeFilter.id);
      removeImportedModularFilter(activeFilter.id);
    }
  }, [activeFilter, setActiveFilterId, removeImportedModularFilter]);

  const [importError, setImportError] = useState("");

  return (
    <Container>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography sx={{ textAlign: "center" }} variant="h4" color="secondary">
          {activeFilter?.name || "Select a filter"}
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {activeFilter?.importedOn
              ? `Imported on ${new Date(activeFilter?.importedOn).toLocaleDateString()}`
              : null}
          </Typography>
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginLeft: "auto",
          }}
        >
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
            }}
            size="small"
          >
            <Select
              disabled={Object.keys(importedModularFilters).length === 0}
              value={activeFilter?.id ?? ""}
              onChange={handleFilterChange}
              renderValue={(value: number | string) => {
                const filter = importedModularFilters[value];
                if (!filter) {
                  return "Select a filter";
                }
                return filter.name;
              }}
              displayEmpty
            >
              {Object.values(importedModularFilters).map((filter, index) => (
                <MenuItem key={index} value={filter.id}>
                  {filter.name}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setOpen(true);
              }}
            >
              Import Filter
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              disabled={activeFilter === undefined}
              onClick={handleDeleteFilter}
            >
              Delete Filter
            </Button>
            <Dialog
              fullWidth
              open={open}
              onClose={() => {
                setFilterUrl("");
                setOpen(false);
              }}
            >
              <DialogTitle>Import Filter</DialogTitle>
              <DialogContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    marginBottom: 2,
                  }}
                >
                  <FormControl>
                    <FormHelperText sx={{ fontSize: "24px" }}>
                      Select a commonly used filter or paste a URL below
                    </FormHelperText>
                    <Select
                      color="secondary"
                      labelId="common-filter-select"
                      value={filterUrl}
                      displayEmpty
                      onChange={(e) => {
                        setFilterUrl(e.target.value);
                        setImportError("");
                      }}
                    >
                      {filtersForImport.map((filter) => (
                        <MenuItem key={filter.url} value={filter.url}>
                          {filter.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Filter URL"
                    value={filterUrl}
                    onChange={(e) => {
                      setFilterUrl(e.target.value);
                      setImportError("");
                    }}
                    error={importError !== ""}
                    helperText={importError}
                  />
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={filterUrl === "" || importError !== ""}
                  onClick={() => {
                    setImportError("");
                    loadFilter({
                      filterUrl: filterUrl,
                    })
                      .catch((error) => {
                        setImportError(error.message);
                      })
                      .then((filter) => {
                        if (filter) {
                          addImportedModularFilter(filter);
                          setActiveFilterId(filter.id);
                          setFilterUrl("");
                          setOpen(false);
                        }
                      });
                  }}
                >
                  Import
                </Button>
              </DialogContent>
            </Dialog>
          </FormControl>
        </Box>
      </Box>
    </Container>
  );
};
