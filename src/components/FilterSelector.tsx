import { IosShare, Update } from '@mui/icons-material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
    Box,
    Button,
    FormControl,
    IconButton,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    Typography,
} from '@mui/material'
import ListItemIcon from '@mui/material/ListItemIcon'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAlertStore } from '../store/alerts'
import { useUiStore } from '../store/store'
import {
    FilterId,
    ModularFilterConfigurationV2,
    UiModularFilter,
} from '../types/ModularFilterSpec'
import { DEV_FILTERS } from '../utils/devFilters'
import { downloadFile } from '../utils/file'
import { createLink } from '../utils/link'
import { fingerprintFilter, loadFilter } from '../utils/modularFilterLoader'
import { renderFilter } from '../utils/render'
import { ImportFilterDialog } from './ImportFilterDialog'
import { Option, UISelect } from './inputs/UISelect'

const COMMON_FILTERS = [
    {
        name: 'FilterScape - An all in one filter for mains',
        url: 'https://raw.githubusercontent.com/riktenx/filterscape/c60bafc2caa3ad7f64b26a2377151ad51ac509d7/index.json',
    },
    {
        name: "Joe's Filter for Persnickety Players",
        url: 'https://raw.githubusercontent.com/typical-whack/loot-filters-modules/ae3ff53258852286a931ae4be8544e8158bff86b/filter.json',
    },
]

export const FilterSelector: React.FC = () => {
    const [open, setOpen] = useState(false)
    const { siteConfig } = useUiStore()

    const filtersForImport = [
        ...(siteConfig.devMode ? DEV_FILTERS : []),
        ...COMMON_FILTERS,
    ]

    const importedModularFilters = useUiStore(
        (state) => state.importedModularFilters
    )
    const setActiveFilterId = useUiStore((state) => state.setActiveFilterId)

    const activeFilter = useMemo(
        () =>
            Object.values(importedModularFilters).find(
                (filter) => filter.active
            ),
        [importedModularFilters]
    )

    const activeFilterConfig: ModularFilterConfigurationV2 | undefined =
        useUiStore(
            (state) =>
                activeFilter && state.filterConfigurations?.[activeFilter.id]
        )

    const removeImportedModularFilter = useUiStore(
        (state) => state.removeImportedModularFilter
    )

    const addNewFilter = useUiStore((state) => state.addImportedModularFilter)
    const addFilterConfiguration = useUiStore(
        (state) => state.addFilterConfiguration
    )

    const handleFilterChange = useCallback(
        (newValue: Option<FilterId> | null) => {
            if (newValue) {
                setActiveFilterId(newValue.value)
            }
        },
        [setActiveFilterId]
    )

    const handleDeleteFilter = useCallback(() => {
        if (activeFilter) {
            removeImportedModularFilter(activeFilter.id)
            setActiveFilterFingerprint(null)
            setNewFilterFingerprint(null)
        }
    }, [activeFilter, setActiveFilterId, removeImportedModularFilter])

    const filterOptions: Option<FilterId>[] = Object.values(
        importedModularFilters
    ).map((filter) => ({
        label: filter.name,
        value: filter.id,
    }))

    const selectedFilter = activeFilter
        ? {
              label: activeFilter.name,
              value: activeFilter.id,
          }
        : null

    const [activeFilterFingerprint, setActiveFilterFingerprint] = useState<
        string | null
    >(null)

    useEffect(() => {
        if (activeFilter != null) {
            fingerprintFilter(activeFilter).then((fingerprint) => {
                setActiveFilterFingerprint(fingerprint)
            })
        }
    }, [activeFilter])

    const [newFilterFingerprint, setNewFilterFingerprint] = useState<
        string | null
    >(null)

    const [updatedFilter, setUpdatedFilter] = useState<UiModularFilter | null>(
        null
    )

    const updateAvailable =
        newFilterFingerprint != null &&
        activeFilterFingerprint != null &&
        newFilterFingerprint !== activeFilterFingerprint

    useEffect(() => {
        if (activeFilter != null) {
            if (Object.hasOwn(activeFilter?.source || {}, 'filterUrl')) {
                loadFilter(activeFilter.source as { filterUrl: string }).then(
                    (newFilter) => {
                        setUpdatedFilter(newFilter)
                        fingerprintFilter(newFilter).then((fingerprint) => {
                            setNewFilterFingerprint(fingerprint)
                        })
                    }
                )
            }
        }
    }, [activeFilterFingerprint])

    const [filterMenuAnchor, setFilterMenuAnchor] =
        useState<HTMLElement | null>(null)

    const addAlert = useAlertStore((state) => state.addAlert)

    return (
        <>
            <Stack spacing={2}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        marginLeft: 'auto',
                    }}
                >
                    <FormControl
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 1,
                        }}
                        size="small"
                    >
                        <UISelect<FilterId>
                            sx={{ width: '300px' }}
                            options={filterOptions}
                            value={selectedFilter}
                            onChange={handleFilterChange}
                            label="Select a filter"
                            disabled={
                                Object.keys(importedModularFilters).length === 0
                            }
                            multiple={false}
                        />
                    </FormControl>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<ContentCopyIcon />}
                        disabled={!activeFilter}
                        onClick={() => {
                            if (!activeFilter) {
                                return
                            }
                            const renderedFilter = renderFilter(
                                activeFilter,
                                activeFilterConfig
                            )
                            navigator.clipboard
                                .writeText(renderedFilter)
                                .then(() => {
                                    addAlert({
                                        children: 'Filter copied to clipboard',
                                        severity: 'success',
                                    })
                                })
                                .catch(() => {
                                    addAlert({
                                        children:
                                            'Failed to copy filter to clipboard',
                                        severity: 'error',
                                    })
                                })
                        }}
                    >
                        Copy to clipboard
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            setOpen(true)
                        }}
                    >
                        Import Filter
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Update />}
                        disabled={
                            newFilterFingerprint != null &&
                            activeFilterFingerprint != null &&
                            newFilterFingerprint === activeFilterFingerprint
                        }
                        onClick={() => {
                            if (!activeFilter) {
                                return
                            }
                            if (updatedFilter != null) {
                                addNewFilter({
                                    ...updatedFilter,
                                    name: `${activeFilter.name} (Updated)`,
                                })
                                setActiveFilterId(updatedFilter.id)
                                addFilterConfiguration(
                                    updatedFilter.id,
                                    activeFilterConfig || {
                                        enabledModules: {},
                                        inputConfigs: {},
                                    }
                                )
                                addAlert({
                                    children: 'Filter updated',
                                    severity: 'success',
                                })
                            }
                        }}
                    >
                        Update Filter
                    </Button>

                    <IconButton
                        onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
                    >
                        <MoreVertIcon />
                    </IconButton>

                    <Menu
                        open={filterMenuAnchor != null}
                        onClose={() => setFilterMenuAnchor(null)}
                        anchorEl={filterMenuAnchor}
                    >
                        <MenuItem
                            disabled={!activeFilter}
                            onClick={handleDeleteFilter}
                        >
                            <ListItemIcon>
                                <DeleteIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Delete</ListItemText>
                        </MenuItem>
                        <MenuItem
                            disabled={!activeFilter}
                            onClick={() => {
                                if (!activeFilter) {
                                    return
                                }
                                const renderedFilter = renderFilter(
                                    activeFilter,
                                    activeFilterConfig
                                )
                                const fileName = `${activeFilter.name}.rs2f`
                                const file = new File(
                                    [renderedFilter],
                                    fileName,
                                    {
                                        type: 'text/plain',
                                    }
                                )
                                downloadFile(file)
                            }}
                        >
                            <ListItemIcon>
                                <DownloadIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Download</ListItemText>
                        </MenuItem>

                        {siteConfig.devMode && (
                            <MenuItem
                                disabled={!activeFilter}
                                onClick={() => {
                                    if (!activeFilter) {
                                        return
                                    }

                                    createLink(
                                        activeFilter,
                                        activeFilterConfig
                                    ).then((link) =>
                                        navigator.clipboard
                                            .writeText(link)
                                            .then(() => {
                                                addAlert({
                                                    children:
                                                        'Filter link copied to clipboard',
                                                    severity: 'success',
                                                })
                                            })
                                            .catch((error) => {
                                                addAlert({
                                                    children:
                                                        'Failed to copy filter link to clipboard',
                                                    severity: 'error',
                                                })
                                            })
                                    )
                                }}
                            >
                                <ListItemIcon>
                                    <IosShare fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Share Link</ListItemText>
                            </MenuItem>
                        )}
                    </Menu>
                </Box>

                <Typography variant="h4" color="secondary">
                    {activeFilter?.name || 'Select a filter'}
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                    >
                        {activeFilter?.importedOn
                            ? `Imported on ${new Date(activeFilter?.importedOn).toLocaleDateString()}`
                            : null}
                    </Typography>
                </Typography>
            </Stack>

            <ImportFilterDialog
                open={open}
                onClose={() => setOpen(false)}
                filtersForImport={filtersForImport}
            />
        </>
    )
}
