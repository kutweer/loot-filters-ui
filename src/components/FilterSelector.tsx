import { Edit, IosShare, Update } from '@mui/icons-material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import ListItemIcon from '@mui/material/ListItemIcon'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlertStore } from '../store/alerts'
import { useUiStore } from '../store/store'
import { GitHubFilterSource } from '../types/GitHubFilterSource'
import {
    FilterId,
    ModularFilterConfigurationV2,
    UiModularFilter,
} from '../types/ModularFilterSpec'
import { downloadFile } from '../utils/file'
import { createLink } from '../utils/link'
import { loadFilter } from '../utils/modularFilterLoader'
import { renderFilter } from '../utils/render'
import { ImportFilterDialog } from './ImportFilterDialog'
import { Option, UISelect } from './inputs/UISelect'

const isGitHubSource = (source: any): source is GitHubFilterSource => {
    return source && 'repo' in source && 'owner' in source
}

const EditFilterDialog: React.FC<{
    open: boolean
    filter: UiModularFilter
    onSave: (name: string) => void
    onClose: () => void
}> = ({ open, filter, onSave, onClose }) => {
    const [name, setName] = useState(filter.name)
    return (
        <Dialog maxWidth="lg" open={open} onClose={onClose}>
            <DialogTitle>Edit Filter</DialogTitle>
            <DialogContent>
                <Box>
                    <TextField
                        size="small"
                        sx={{ width: '350px', mt: 1 }}
                        label="Filter Name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 10,
                        mt: 3,
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            onSave(name)
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}
export const FilterSelector: React.FC<{ reloadOnChange?: boolean }> = ({
    reloadOnChange,
}) => {
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const { siteConfig } = useUiStore()

    const importedModularFilters = useUiStore(
        (state) => state.importedModularFilters
    )
    const setActiveFilterId = useUiStore((state) => state.setActiveFilterId)

    const [importDialogOpen, setImportDialogOpen] = useState(
        Object.keys(importedModularFilters).length === 0
    )

    const navigate = useNavigate()

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
                if (reloadOnChange) {
                    window.location.reload()
                }
            }
        },
        [setActiveFilterId]
    )
    const setFilterName = useUiStore((state) => state.setFilterName)

    const handleDeleteFilter = useCallback(() => {
        if (Object.keys(importedModularFilters).length === 1) {
            setImportDialogOpen(true)
        }
        if (activeFilter) {
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

    const [updatedFilter, setUpdatedFilter] = useState<UiModularFilter | null>(
        null
    )

    useEffect(() => {
        if (activeFilter != null) {
            console.log('checking for updates')
            if (isGitHubSource(activeFilter?.source)) {
                console.log('loading filter')
                loadFilter(activeFilter.source).then((newFilter) => {
                    console.log('loaded filter', newFilter)
                    setUpdatedFilter(newFilter)
                })
            }
        }
    }, [activeFilter])

    const [filterMenuAnchor, setFilterMenuAnchor] =
        useState<HTMLElement | null>(null)

    const addAlert = useAlertStore((state) => state.addAlert)

    const activeFilterSha = isGitHubSource(activeFilter?.source)
        ? activeFilter?.source.updateMeta?.sha
        : undefined
    const updatedFilterSha = isGitHubSource(updatedFilter?.source)
        ? updatedFilter?.source.updateMeta?.sha
        : undefined

    const updateAvailable =
        activeFilterSha !== undefined &&
        updatedFilterSha !== undefined &&
        activeFilterSha !== updatedFilterSha

    console.log('activeFilter', activeFilter?.source)
    console.log('updatedFilter', updatedFilter?.source, updatedFilter)
    console.log(activeFilterSha, updatedFilterSha, updateAvailable)

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

                                const updatedAt = new Date(
                                    (
                                        updatedFilter.source!! as GitHubFilterSource
                                    ).updateMeta!!.updatedAt
                                ).toLocaleDateString()

                                addNewFilter({
                                    ...updatedFilter,
                                    name:
                                        name.replace(/ \(updated: .*\)$/, '') +
                                        ` (updated: ${updatedAt})`,
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
                            onClick={() => {
                                setEditDialogOpen(true)
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
                open={importDialogOpen}
                onClose={() => setImportDialogOpen(false)}
            />
            {activeFilter && (
                <EditFilterDialog
                    open={editDialogOpen}
                    filter={activeFilter}
                    onClose={() => setEditDialogOpen(false)}
                    onSave={(name) => {
                        setFilterName(activeFilter.id, name)
                        addAlert({
                            children: 'Filter name updated',
                            severity: 'success',
                        })
                        setEditDialogOpen(false)
                    }}
                />
            )}
        </>
    )
}
