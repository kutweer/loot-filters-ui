import { Download, IosShare } from "@mui/icons-material";
import {
  Alert,
  AlertColor,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import { useUiStore } from "../store/store";
import {
  FilterId,
  FilterModule,
  ModuleSource,
} from "../types/ModularFilterSpec";
import { copyToClipboard } from "../utils/clipboard";
import { DEV_FILTERS } from "../utils/devFilters";
import { downloadFile } from "../utils/file";
import { createLink } from "../utils/link";
import { loadFilter } from "../utils/modularFilterLoader";
import { renderFilter } from "../utils/render";
import { Option, UISelect } from "./inputs/UISelect";

const COMMON_FILTERS = [
  {
    name: "FilterScape - An all in one filter for mains",
    url: "https://raw.githubusercontent.com/riktenx/filterscape/refs/heads/main/index.json",
  },
  {
    name: "Joe's Loot Filter for Persnickety Irons",
    url: "https://raw.githubusercontent.com/typical-whack/loot-filters-modules/679554a14c69d0e5785f479138e47e0bb9e7582c/filter.json",
  },
];

export const FilterSelector: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [filterUrl, setFilterUrl] = useState("");
  const { siteConfig } = useUiStore();
  const [alerts, setAlerts] = useState<{ text: string; severity: string }[]>(
    []
  );

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

  const activeFilterConfig = useUiStore(
    (state) => activeFilter && state.filterConfigurations?.[activeFilter.id]
  );

  const removeImportedModularFilter = useUiStore(
    (state) => state.removeImportedModularFilter
  );

  const handleFilterChange = useCallback(
    (newValue: Option<FilterId> | null) => {
      if (newValue) {
        setActiveFilterId(newValue.value);
      }
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

  const filterOptions: Option<FilterId>[] = Object.values(
    importedModularFilters
  ).map((filter) => ({
    label: filter.name,
    value: filter.id,
  }));

  const selectedFilter = activeFilter
    ? {
        label: activeFilter.name,
        value: activeFilter.id,
      }
    : null;

  const handleImportFilterChange = useCallback(
    (newValue: Option<string> | null) => {
      if (newValue) {
        setFilterUrl(newValue.value);
        setImportError("");
      }
    },
    []
  );

  return (
    <>
      {alerts.map((alert, index) => (
        <Alert
          key={index}
          sx={{ bgcolor: "background.paper" }}
          severity={alert.severity as AlertColor}
          onClose={() => {
            setAlerts((prev) => prev.filter((_, i) => i !== index));
          }}
        >
          {alert.text}
        </Alert>
      ))}
      <Stack spacing={2}>
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
            <UISelect<FilterId>
              sx={{ width: "300px" }}
              options={filterOptions}
              value={selectedFilter}
              onChange={handleFilterChange}
              label="Select a filter"
              disabled={Object.keys(importedModularFilters).length === 0}
              multiple={false}
            />
          </FormControl>
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
            {activeFilter && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Download />}
                  onClick={() => {
                    const renderedFilter = renderFilter(
                      activeFilter,
                      activeFilterConfig
                    );
                    const fileName = `${activeFilter.name}.rs2f`;
                    const file = new File([renderedFilter], fileName, {
                      type: "text/plain",
                    });
                    downloadFile(file);
                  }}
                >
                  Download Filter
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<IosShare />}
                  onClick={() => {
                    createLink(activeFilter, activeFilterConfig)
                      .then((link) => copyToClipboard(link))
                      .then(() => {
                        const alert = {
                          text: "Link copied to clipboard",
                          severity: "success",
                        };
                        setAlerts((prev) => [...prev, alert]);
                        setTimeout(() => {
                          setAlerts((prev) =>
                            prev.filter((a) => a.text !== alert.text)
                          );
                        }, 3000);
                      })
                      .catch((error) => {
                        const alert = {
                          text: `Failed to copy link to clipboard: ${error}`,
                          severity: "error",
                        };
                        setAlerts((prev) => [...prev, alert]);
                      });
                  }}
                >
                  Share Link
                </Button>
              </>
            )}
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
                    <UISelect<string>
                      options={filtersForImport.map((filter) => ({
                        label: filter.name,
                        value: filter.hasOwnProperty("url")
                          ? (filter as { url: string }).url
                          : JSON.stringify(filter),
                      }))}
                      value={
                        filterUrl
                          ? { label: filterUrl, value: filterUrl }
                          : null
                      }
                      onChange={handleImportFilterChange}
                      label="Select a filter"
                      multiple={false}
                    />
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
                    if (filterUrl.startsWith("http")) {
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
                    } else {
                      const filter = {
                        ...JSON.parse(filterUrl),
                        id: crypto.randomUUID(),
                      };

                      filter.modules = filter.modules.map(
                        (module: ModuleSource) => ({
                          ...(module as { moduleJson: FilterModule })
                            .moduleJson,
                          id: crypto.randomUUID(),
                        })
                      );

                      addImportedModularFilter(filter);
                      setActiveFilterId(filter.id);
                      setFilterUrl("");
                      setOpen(false);
                    }
                  }}
                >
                  Import
                </Button>
              </DialogContent>
            </Dialog>
        </Box>

        <Typography variant="h4" color="secondary">
          {activeFilter?.name || "Select a filter"}
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {activeFilter?.importedOn
              ? `Imported on ${new Date(activeFilter?.importedOn).toLocaleDateString()}`
              : null}
          </Typography>
        </Typography>
      </Stack>
    </>
  );
};
