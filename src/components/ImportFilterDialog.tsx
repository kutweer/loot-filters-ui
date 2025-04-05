import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Dialog,
    DialogContent,
    FormControl,
    FormHelperText,
    Grid2,
    TextField,
    Typography,
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useUiStore } from '../store/store'
import { FilterModule, ModuleSource } from '../types/ModularFilterSpec'
import { DEV_FILTERS } from '../utils/devFilters'
import { loadFilter } from '../utils/modularFilterLoader'
import { Option, UISelect } from './inputs/UISelect'

interface ImportFilterDialogProps {
    open: boolean
    onClose: () => void
}

const FILTERSCAPE_FILTER =
    'github:' +
    JSON.stringify({
        owner: 'riktenx',
        repo: 'filterscape',
        branch: 'main',
        filterPath: 'index.json',
    })
const JOES_FILTER =
    'github:' +
    JSON.stringify({
        owner: 'typical-whack',
        repo: 'loot-filters-modules',
        branch: 'main',
        filterPath: 'filter.json',
    })

export const ImportFilterDialog: React.FC<ImportFilterDialogProps> = ({
    open,
    onClose,
}) => {
    const [filterUrl, setFilterUrl] = useState('')
    const [filterNameOverride, setFilterNameOverride] = useState('')
    const [importError, setImportError] = useState('')

    const devMode = useUiStore((state) => state.siteConfig.devMode)

    const addImportedModularFilter = useUiStore(
        (state) => state.addImportedModularFilter
    )
    const setActiveFilterId = useUiStore((state) => state.setActiveFilterId)

    const handleImportFilterChange = useCallback(
        (newValue: Option<string> | null) => {
            if (newValue) {
                setFilterUrl(newValue.value)
                setImportError('')
            }
        },
        []
    )

    const handleClose = () => {
        setFilterUrl('')
        setFilterNameOverride('')
        setShowURLImportOptions(false)
        setLoading(false)
        onClose()
    }

    const importGithubFilter = (str: string) => {
        const source = JSON.parse(str.slice('github:'.length))
        console.log('Loading github filter:', source)
        return loadFilter({
            ...source,
        })
            .catch((error) => {
                setImportError(error.message)
            })
            .then((filter) => {
                if (filter) {
                    if (filterNameOverride !== '') {
                        filter.name = filterNameOverride
                    }
                    addImportedModularFilter(filter)
                    setActiveFilterId(filter.id)
                    handleClose()
                }
                return filter
            })
    }

    const [loading, setLoading] = useState(false)

    const [showURLImportOptions, setShowURLImportOptions] = useState(false)

    return (
        <Dialog fullWidth maxWidth="xl" open={open} onClose={handleClose}>
            <DialogContent>
                <Grid2
                    container
                    spacing={2}
                    sx={{ mt: 2, justifyContent: 'center' }}
                >
                    <Grid2 size={3}>
                        <Typography
                            variant="h6"
                            fontSize="36px"
                            component="div"
                            sx={{ color: 'text.primary', fontSize: '24px' }}
                        >
                            What is this Website?
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: '#CCCCCC', fontSize: '24px' }}
                        >
                            <p>
                                FilterScape.xyz makes it easy to customize a
                                filter for the loot-filters plugin.
                            </p>
                            <p>
                                It provides previews for your item labels,
                                groups configurations by item type, and more.
                            </p>
                        </Typography>
                    </Grid2>

                    <Grid2 size={1} />

                    <Grid2 size={3}>
                        <Typography
                            variant="h6"
                            fontSize="36px"
                            component="div"
                            sx={{ color: 'text.primary', fontSize: '24px' }}
                        >
                            What is the Loot Filters Plugin?
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: '#CCCCCC', fontSize: '24px' }}
                        >
                            <p>
                                <a href="https://runelite.net/plugin-hub/show/loot-filters">
                                    Loot Filters
                                </a>{' '}
                                is a replacement for the built-in Ground Items
                                plugin and supports a much more powerful set of
                                configuration options through its scriptable
                                filters.
                            </p>

                            <p>
                                The plugin lets you configure how and when items
                                are displayed based on many conditions like: if
                                they are noted, how many are in the stack, and
                                even where you are in the game world.
                            </p>
                        </Typography>
                    </Grid2>
                    <Grid2 size={1} />

                    <Grid2 size={3}>
                        <Typography
                            variant="h6"
                            fontSize="36px"
                            component="div"
                            sx={{ color: 'text.primary', fontSize: '24px' }}
                        >
                            What is a Filter?
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: '#CCCCCC', fontSize: '24px' }}
                        >
                            <p>
                                A filter is a script that controls how items are
                                displayed in the game. This website provides 2
                                built-in filters that you can configure and use
                                without any scripting.
                            </p>
                            <p>
                                You can also import a filter from a URL. This
                                allows you to customize and use other filters
                                outside of the 2 presets.
                            </p>
                        </Typography>
                    </Grid2>
                </Grid2>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography
                        fontSize="40px"
                        component="div"
                        sx={{ color: 'text.primary', mt: 2, mb: 2 }}
                    >
                        Pick a filter to import
                    </Typography>
                </div>
                <Grid2
                    container
                    spacing={2}
                    justifyContent="center"
                    display={showURLImportOptions ? 'none' : 'flex'}
                >
                    <Grid2 size={3}>
                        <Card variant="outlined">
                            <CardActionArea
                                disabled={loading}
                                onClick={(e) => {
                                    setLoading(true)
                                    importGithubFilter(FILTERSCAPE_FILTER)
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        fontSize="36px"
                                        component="div"
                                    >
                                        FilterScape
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        fontSize="24px"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        An all in one filter for mains.
                                        Configurable styling for most monsters
                                        and bosses.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="secondary"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        window.open(
                                            'https://github.com/riktenx/filterscape',
                                            '_blank'
                                        )
                                    }}
                                >
                                    GitHub
                                </Button>
                                <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                        }}
                                    >
                                        RiktenX & Abstain
                                    </Typography>
                                </div>
                            </CardActions>
                        </Card>
                    </Grid2>
                    <Grid2 size={1} />
                    <Grid2 size={3}>
                        <Card variant="outlined">
                            <CardActionArea
                                onClick={(e) => {
                                    setLoading(true)
                                    importGithubFilter(JOES_FILTER)
                                }}
                                disabled={loading}
                            >
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        fontSize="36px"
                                        component="div"
                                    >
                                        Joe's Filter
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            fontSize: '24px',
                                        }}
                                    >
                                        A filter for the more persnickety
                                        players.
                                        <br />
                                        Goal is customizable styling for every
                                        item in every context.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="secondary"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        window.open(
                                            'https://github.com/typical-whack/loot-filters-modules',
                                            '_blank'
                                        )
                                    }}
                                >
                                    GitHub
                                </Button>
                                <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Joe
                                    </Typography>
                                </div>
                            </CardActions>
                        </Card>
                    </Grid2>
                    <Grid2 size={1} />
                    <Grid2 size={3}>
                        <Card variant="outlined">
                            <CardActionArea
                                onClick={() => setShowURLImportOptions(true)}
                            >
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        fontSize="36px"
                                    >
                                        From a URL
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            fontSize: '24px',
                                        }}
                                    >
                                        Import a filter from a pastebin,
                                        raw.githubusercontent.com url etc.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid2>
                </Grid2>
                <Box
                    sx={{
                        display: showURLImportOptions ? 'flex' : 'none',
                        flexDirection: 'column',
                        gap: 2,
                        marginBottom: 2,
                    }}
                >
                    <FormControl>
                        <FormHelperText sx={{ fontSize: '24px' }}>
                            Paste in your URL, and optionally, give the filter a
                            customized name.
                        </FormHelperText>
                        <UISelect<string>
                            sx={{
                                display: devMode ? 'block' : 'none',
                            }}
                            options={DEV_FILTERS.map((filter) => ({
                                label: filter.name,
                                value:
                                    'url' in filter
                                        ? (filter['url'] as string)
                                        : 'github' in filter
                                          ? `github:${JSON.stringify(filter['github'])}`
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
                            setFilterUrl(e.target.value)
                            setImportError('')
                        }}
                        error={importError !== ''}
                        helperText={importError}
                    />
                    <TextField
                        label="Filter Name Override"
                        value={filterNameOverride}
                        onChange={(e) => {
                            setFilterNameOverride(e.target.value)
                        }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                        }}
                    >
                        <Button
                            disabled={filterUrl.length === 0}
                            variant="outlined"
                            color="primary"
                            onClick={(e) => {
                                console.log(e)
                                setImportError('')

                                const isUrl = filterUrl.startsWith('http')
                                const isGithub = filterUrl.startsWith('github:')
                                console.log(
                                    'filterUrl:',
                                    filterUrl,
                                    'isUrl:',
                                    isUrl,
                                    'isGithub:',
                                    isGithub
                                )
                                if (isUrl) {
                                    loadFilter({
                                        filterUrl: filterUrl,
                                    })
                                        .catch((error) => {
                                            setImportError(error.message)
                                        })
                                        .then((filter) => {
                                            if (filter) {
                                                if (filterNameOverride !== '') {
                                                    filter.name =
                                                        filterNameOverride
                                                }
                                                addImportedModularFilter(filter)
                                                setActiveFilterId(filter.id)
                                                handleClose()
                                            }
                                        })
                                } else if (isGithub) {
                                    importGithubFilter(filterUrl)
                                } else {
                                    const filter = {
                                        ...JSON.parse(filterUrl),
                                        id: crypto.randomUUID(),
                                    }

                                    if (filter)
                                        filter.modules = filter.modules.map(
                                            (module: ModuleSource) => ({
                                                ...(
                                                    module as {
                                                        moduleJson: FilterModule
                                                    }
                                                ).moduleJson,
                                                id: crypto.randomUUID(),
                                                rs2fText: (
                                                    module as {
                                                        moduleRs2fText: string
                                                    }
                                                ).moduleRs2fText,
                                            })
                                        )
                                    if (filterNameOverride !== '') {
                                        filter.name = filterNameOverride
                                    }

                                    addImportedModularFilter(filter)
                                    setActiveFilterId(filter.id)
                                    handleClose()
                                }
                            }}
                        >
                            Import
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setShowURLImportOptions(false)}
                        >
                            Back
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    )
}
