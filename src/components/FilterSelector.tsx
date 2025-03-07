import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { loadFilter } from "../utils/modularFilterLoader";
import { ModularFilterId, useData } from "../utils/storage";

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
