import { Edit, FiberNew, FileCopy, IosShare, Update } from '@mui/icons-material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
    Box,
    FormControl,
    IconButton,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    Tooltip,
} from '@mui/material'
import ListItemIcon from '@mui/material/ListItemIcon'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    DEFAULT_FILTER_CONFIGURATION,
    Filter,
    FilterConfigurationSpec,
    FilterId,
} from '../parsing/UiTypesSpec'
import { useAlertStore } from '../store/alerts'
import { useFilterConfigStore } from '../store/filterConfigurationStore'
import { useFilterStore } from '../store/filterStore'
import { colors } from '../styles/MuiTheme'
import { downloadFile } from '../utils/file'
import { generateId } from '../utils/idgen'
import { createLink } from '../utils/link'
import { loadFilterFromUrl } from '../utils/loaderv2'
import { renderFilter } from '../utils/render'
import { ImportFilterDialog } from './ImportFilterDialog'
import { Option, UISelect } from './inputs/UISelect'

const SmartTooltip = ({
    enabledTitle,
    disabledTitle,
    enabled,
    children,
}: {
    enabledTitle: string
    disabledTitle: string
    enabled: boolean
    children: React.ReactNode
}) => {
    return (
        <Tooltip title={enabled ? enabledTitle : disabledTitle}>
            {/* span is required to prevent tooltip from being disabled when input is disabled */}
            <span>{children}</span>
        </Tooltip>
    )
}

export const FilterSelector: React.FC<{ reloadOnChange?: boolean }> = ({
    reloadOnChange,
}) => {
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

    const importFilterButton = (
        <Tooltip title="Import a new filter">
            <IconButton
                color="primary"
                onClick={() => {
                    setImportDialogOpen(true)
                }}
            >
                <FiberNew style={{ color: colors.rsOrange }} />
            </IconButton>
        </Tooltip>
    )

    const copyToClipboardButton = (
        <SmartTooltip
            enabledTitle="Copy filter to clipboard"
            disabledTitle="No filter selected"
            enabled={activeFilter != null}
        >
            <IconButton
                color="primary"
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
                                children: 'Failed to copy filter to clipboard',
                                severity: 'error',
                            })
                        })
                }}
            >
                <ContentCopyIcon style={{ color: colors.rsOrange }} />
            </IconButton>
        </SmartTooltip>
    )

    const updateFilterButton = (
        <SmartTooltip
            enabledTitle="Update filter"
            disabledTitle="No updates available"
            enabled={updateAvailable}
        >
            <span>
                <IconButton
                    disabled={!updateAvailable}
                    onClick={() => {
                        if (!activeFilter) {
                            return
                        }
                        if (updatedFilter != null) {
                            let name = activeFilter.name

                            const updatedAt = new Date().toLocaleDateString()

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
                    <Update
                        style={{
                            color: updateAvailable
                                ? colors.rsOrange
                                : 'disabled',
                        }}
                    />
                </IconButton>
            </span>
        </SmartTooltip>
    )

    const shareFilterButton = (
        <SmartTooltip
            enabledTitle="Share filter link"
            disabledTitle="Filters without a source URL cannot be shared"
            enabled={activeFilter?.source != null}
        >
            <span>
                <IconButton
                    disabled={!activeFilter || !activeFilter.source}
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

                        createLink(activeFilter, activeFilterConfig)
                            .then((link) => {
                                return navigator.clipboard
                                    .writeText(link)
                                    .then(() => {
                                        addAlert({
                                            children:
                                                'Filter link copied to clipboard',
                                            severity: 'success',
                                        })
                                    })
                            })
                            .catch((error) => {
                                console.error(error)
                                addAlert({
                                    children: `Failed to copy filter link to clipboard: ${error instanceof Error ? error.message : 'Unknown error'}`,
                                    severity: 'error',
                                })
                            })
                    }}
                >
                    <IosShare
                        style={{
                            color: activeFilter?.source
                                ? colors.rsOrange
                                : 'disabled',
                        }}
                    />
                </IconButton>
            </span>
        </SmartTooltip>
    )

    const menuButton = (
        <IconButton onClick={(e) => setFilterMenuAnchor(e.currentTarget)}>
            <MoreVertIcon
                style={{
                    color: colors.rsDarkOrange,
                }}
            />
        </IconButton>
    )

    const menu = (
        <Menu
            open={filterMenuAnchor != null}
            onClose={() => setFilterMenuAnchor(null)}
            anchorEl={filterMenuAnchor}
        >
            <SmartTooltip
                enabledTitle="Edit filter"
                disabledTitle="No filter selected"
                enabled={activeFilter != null}
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
            </SmartTooltip>
            <SmartTooltip
                enabledTitle="Delete filter"
                disabledTitle="No filter selected"
                enabled={activeFilter != null}
            >
                <MenuItem disabled={!activeFilter} onClick={handleDeleteFilter}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </SmartTooltip>
            <SmartTooltip
                enabledTitle="Download filter"
                disabledTitle="No filter selected"
                enabled={activeFilter != null}
            >
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
                        const file = new File([renderedFilter], fileName, {
                            type: 'text/plain',
                        })
                        downloadFile(file)
                    }}
                >
                    <ListItemIcon>
                        <DownloadIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download</ListItemText>
                </MenuItem>
            </SmartTooltip>
            <SmartTooltip
                enabledTitle="Duplicate filter with current settings"
                disabledTitle="No filter selected"
                enabled={activeFilter != null}
            >
                <MenuItem
                    disabled={!activeFilter}
                    onClick={() => {
                        if (!activeFilter) {
                            return
                        }

                        const newId = generateId()

                        setFilterConfiguration(
                            newId,
                            activeFilterConfig || DEFAULT_FILTER_CONFIGURATION
                        )

                        updateFilter({
                            ...activeFilter,
                            id: newId,
                            name: `${activeFilter.name} (copy)`,
                        })

                        setActiveFilter(newId)
                        addAlert({
                            children: 'Filter duplicated',
                            severity: 'success',
                        })
                    }}
                >
                    <ListItemIcon>
                        <FileCopy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Duplicate</ListItemText>
                </MenuItem>
            </SmartTooltip>
        </Menu>
    )

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

                    {importFilterButton}
                    {copyToClipboardButton}
                    {updateFilterButton}
                    {shareFilterButton}
                    {menuButton}
                    {menu}
                </Box>
            </Stack>

            <ImportFilterDialog
                open={importDialogOpen}
                onClose={() => setImportDialogOpen(false)}
            />
        </>
    )
}
