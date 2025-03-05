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
import { StoredData, StoredDataUpdater } from "../utils/dataStorage";
import { loadFilter } from "../utils/filtermanager";

export const FilterSelector: React.FC<{
  storedData: StoredData;
  setStoredData: StoredDataUpdater;
}> = ({ storedData, setStoredData }) => {
  const [open, setOpen] = useState(false);
  const [filterUrl, setFilterUrl] = useState("");

  const activeFilterIndex = storedData.selectedFilterIndex;

  const activeFilter =
    activeFilterIndex >= 0
      ? storedData.filters[storedData.selectedFilterIndex]
      : null;

  console.log("rendering FilterSelector");

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
              value={activeFilterIndex >= 0 ? activeFilterIndex : ""}
              onChange={(e) => {
                console.log("onChange", e.target.value, typeof e.target.value);
                setStoredData((prev) => ({
                  ...prev,
                  selectedFilterIndex: e.target.value as number,
                }));
              }}
              renderValue={(value: number | string) => {
                console.log("renderValue", value);
                if (typeof value === "string") {
                  return "Select a filter";
                }
                return storedData.filters[value].name;
              }}
              displayEmpty
            >
              {storedData.filters.map((filter, index) => (
                <MenuItem key={index} value={index}>
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
              onClick={() => {
                setStoredData((prev) => {
                  console.log("deleting filter", prev.selectedFilterIndex);
                  const newFilters = [...prev.filters];
                  newFilters.splice(prev.selectedFilterIndex, 1);
                  const updated = {
                    ...prev,
                    filters: newFilters,
                    selectedFilterIndex: -1,
                  };
                  return updated;
                });
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
                    console.log(filterUrl);
                    loadFilter({
                      url: filterUrl,
                    }).then((filter) => {
                      setStoredData((prev) => ({
                        ...prev,
                        filters: [...prev.filters, filter],
                      }));
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
