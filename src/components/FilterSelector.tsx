import { Download, IosShare } from '@mui/icons-material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Box, Button, FormControl, Stack, Typography } from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import { useAlertStore } from '../store/alerts'
import { useUiStore } from '../store/store'
import { FilterId, ModularFilterConfigurationV2 } from '../types/ModularFilterSpec'
import { DEV_FILTERS } from '../utils/devFilters'
import { downloadFile } from '../utils/file'
import { createLink } from '../utils/link'
import { renderFilter } from '../utils/render'
import { ImportFilterDialog } from './ImportFilterDialog'
import { Option, UISelect } from './inputs/UISelect'

const COMMON_FILTERS = [
    {
        name: 'FilterScape - An all in one filter for mains',
        url: 'https://raw.githubusercontent.com/riktenx/filterscape/refs/heads/main/index.json',
    },
    {
        name: "Joe's Filter for Persnickety Players",
        url: 'https://raw.githubusercontent.com/typical-whack/loot-filters-modules/refs/heads/main/filter.json',
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

    const activeFilterConfig : ModularFilterConfigurationV2 | undefined = useUiStore(
        (state) => activeFilter && state.filterConfigurations?.[activeFilter.id]
    )

    const removeImportedModularFilter = useUiStore(
        (state) => state.removeImportedModularFilter
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
            setActiveFilterId(activeFilter.id)
            removeImportedModularFilter(activeFilter.id)
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
                        color="secondary"
                        onClick={() => {
                            setOpen(true)
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
                                startIcon={<ContentCopyIcon />}
                                onClick={() => {
                                    const renderedFilter = renderFilter(
                                        activeFilter,
                                        activeFilterConfig
                                    )
                                    navigator.clipboard
                                        .writeText(renderedFilter)
                                        .then(() => {
                                            addAlert({
                                                children:
                                                    'Filter copied to clipboard',
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
                                startIcon={<Download />}
                                onClick={() => {
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
                                Download
                            </Button>
                            {siteConfig.devMode ? (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<IosShare />}
                                    onClick={() => {
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
                                    Share Link
                                </Button>
                            ) : null}
                        </>
                    )}
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
