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
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useData } from "../context/UiDataContext";
import { loadFilter } from "../utils/modularFilterLoader";
import { ModularFilterId } from "../utils/storage";
import useSiteConfig from "../utils/devmode";

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
];

export const FilterSelector: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [filterUrl, setFilterUrl] = useState("");
  const {
    data: { activeFilterId, importedModularFilters },
    setActiveFilter,
    addNewImportedModularFilter: setNewImportedModularFilter,
    setModularFilterRemoved,
    getActiveFilter,
  } = useData();

  const activeFilter = getActiveFilter();

  const [siteConfig, _] = useSiteConfig();

  const filtersForImport = [
    ...(siteConfig.devMode ? DEV_FILTERS : []),
    ...COMMON_FILTERS,
  ];

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
              value={activeFilterId}
              onChange={(e) => {
                setActiveFilter(e.target.value as ModularFilterId);
              }}
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
              disabled={activeFilterId === undefined}
              onClick={() => {
                if (activeFilterId) {
                  setModularFilterRemoved(activeFilterId);
                }
              }}
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
                      onChange={(e) => setFilterUrl(e.target.value)}
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
                    onChange={(e) => setFilterUrl(e.target.value)}
                  />
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    loadFilter({
                      filterUrl: filterUrl,
                    }).then((filter) => {
                      setNewImportedModularFilter(filter.id, filter);
                      setFilterUrl("");
                      setOpen(false);
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
