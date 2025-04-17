import { Edit, IosShare, Update } from '@mui/icons-material'
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
import { useNavigate } from 'react-router-dom'
import {
    Filter,
    FilterConfigurationSpec,
    FilterId,
} from '../parsing/UiTypesSpec'
import { useAlertStore } from '../store/alerts'
import { useFilterConfigStore } from '../store/filterConfigurationStore'
import { useFilterStore } from '../store/filterStore'
import { useSiteConfigStore } from '../store/siteConfig'
import { downloadFile } from '../utils/file'
import { createLink } from '../utils/link'
import { loadFilterFromUrl } from '../utils/loaderv2'
import { renderFilter } from '../utils/render'
import { ImportFilterDialog } from './ImportFilterDialog'
import { Option, UISelect } from './inputs/UISelect'

export const FilterSelector: React.FC<{ reloadOnChange?: boolean }> = ({
    reloadOnChange,
}) => {
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const { siteConfig } = useSiteConfigStore()

    const { filters, removeFilter, setActiveFilter, updateFilter } =
        useFilterStore()

    const { setFilterConfiguration, removeFilterConfiguration } =
        useFilterConfigStore()

    const [importDialogOpen, setImportDialogOpen] = useState(
        Object.keys(filters).length === 0
    )
    const [prefixDialogOpen, setPrefixDialogOpen] = useState(false)

    const navigate = useNavigate()

    const activeFilter = useMemo(
        () => Object.values(filters).find((filter) => filter.active),
        [filters]
    )

    const activeFilterConfig = FilterConfigurationSpec.optional().parse(
        useFilterConfigStore(
            (state) =>
                activeFilter && state.filterConfigurations?.[activeFilter?.id]
        )
    )

    const handleFilterChange = useCallback(
        (newValue: Option<FilterId> | null) => {
            if (newValue) {
                setActiveFilter(newValue.value)
                if (reloadOnChange) {
                    window.location.reload()
                }
            }
        },
        [setActiveFilter]
    )
    const handleDeleteFilter = useCallback(() => {
        if (Object.keys(filters).length === 1) {
            setImportDialogOpen(true)
        }
        if (activeFilter) {
            removeFilter(activeFilter.id)
            removeFilterConfiguration(activeFilter.id)
        }
    }, [activeFilter, setActiveFilter, removeFilter, removeFilterConfiguration])

    const filterOptions: Option<FilterId>[] = Object.values(filters).map(
        (filter) => ({
            label: filter.name,
            value: filter.id,
        })
    )

    const selectedFilter = activeFilter
        ? {
              label: activeFilter.name,
              value: activeFilter.id,
          }
        : null

    const [updatedFilter, setUpdatedFilter] = useState<Filter | null>(null)

    const addAlert = useAlertStore((state) => state.addAlert)

    useEffect(() => {
        if (activeFilter != null && activeFilter.source != null) {
            loadFilterFromUrl(activeFilter.source)
                .then((newFilter) => {
                    setUpdatedFilter(newFilter)
                })
                .catch((e) => {
                    addAlert({
                        children: `Failed to check for updates to filter: ${e.message}`,
                        severity: 'error',
                    })
                })
        }
    }, [activeFilter])

    const [filterMenuAnchor, setFilterMenuAnchor] =
        useState<HTMLElement | null>(null)

    const activeFilterSha = activeFilter?.rs2fHash
    const updatedFilterSha = updatedFilter?.rs2fHash

    const updateAvailable =
        updatedFilterSha !== undefined && activeFilterSha !== updatedFilterSha

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
                            disabled={Object.keys(filters).length === 0}
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
                            setImportDialogOpen(true)
                        }}
                    >
                        Import New Filter
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Update />}
                        disabled={!updateAvailable}
                        onClick={() => {
                            if (!activeFilter) {
                                return
                            }
                            if (updatedFilter != null) {
                                let name = activeFilter.name

                                const updatedAt =
                                    new Date().toLocaleDateString()

                                updateFilter({
                                    ...updatedFilter,
                                    name:
                                        name.replace(/ \(updated: .*\)$/, '') +
                                        ` (updated: ${updatedAt})`,
                                })
                                setActiveFilter(updatedFilter.id)
                                setFilterConfiguration(
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
                            onClick={() => {
                                navigate(`/editor/${activeFilter!!.id}`)
                            }}
                        >
                            <ListItemIcon>
                                <Edit />
                            </ListItemIcon>
                            <ListItemText>Edit Filter</ListItemText>
                        </MenuItem>
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

                        <MenuItem
                            disabled={!activeFilter}
                            onClick={() => {
                                if (!activeFilter) {
                                    return
                                }

                                if (activeFilter.source === null) {
                                    addAlert({
                                        children:
                                            'Filters without a source URL cannot be shared',
                                        severity: 'error',
                                    })
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
                open={importDialogOpen}
                onClose={() => setImportDialogOpen(false)}
            />
        </>
    )
}
