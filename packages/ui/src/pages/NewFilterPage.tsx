import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Grid2,
    TextField,
    Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    DEFAULT_FILTER_CONFIGURATION,
    FilterSpec,
} from '../parsing/UiTypesSpec'
import { useAlertStore } from '../store/alerts'
import { useFilterStore } from '../store/filterStore'
import { useOboardingStore } from '../store/onboarding'
import { generateId } from '../utils/idgen'
import { createLink } from '../utils/link'
import { loadFilterFromUrl } from '../utils/loaderv2'

interface ImportFilterDialogProps {
    open: boolean
    onClose: () => void
}

const FILTERSCAPE_FILTER =
    'https://raw.githubusercontent.com/riktenx/filterscape/refs/heads/main/filter.rs2f'
const JOES_FILTER =
    'https://raw.githubusercontent.com/typical-whack/loot-filters-modules/refs/heads/main/filter.rs2f'

export const NewFilterPage: React.FC = () => {
    const { addAlert } = useAlertStore()
    const [filterUrl, setFilterUrl] = useState('')
    const [importError, setImportError] = useState('')
    const { filters, updateFilter, setActiveFilter } = useFilterStore()
    const navigate = useNavigate()

    const handleClose = () => {
        setFilterUrl('')
        setShowURLImportOptions(false)
        setLoading(false)
        navigate('/')
    }

    const [loading, setLoading] = useState(false)
    const [showURLImportOptions, setShowURLImportOptions] = useState(false)
    const { onboardingComplete, setOnboardingComplete } = useOboardingStore()

    const loadFilter = (url: string) => {
        setLoading(true)
        return loadFilterFromUrl(url)
            .then((newFilter) => {
                console.log(newFilter)
                if (newFilter) {
                    const matchingFiltersCount = Object.values(filters)
                        .filter((filter) => filter.source == newFilter.source)
                        .sort((oldFilter, newFilter) =>
                            oldFilter.importedOn.localeCompare(
                                newFilter.importedOn
                            )
                        ).length
                    if (matchingFiltersCount > 0) {
                        newFilter.name = `${newFilter.name} (${matchingFiltersCount})`
                    }
                    updateFilter(newFilter)
                    setActiveFilter(newFilter.id)
                    handleClose()
                }
            })
            .catch((error) => {
                addAlert({
                    children: error.message,
                    severity: 'error',
                })
            })
    }

    return (
        <div>
            <Box>
                <Button
                    onClick={() => {
                        setOnboardingComplete(!onboardingComplete)
                    }}
                    sx={{ float: 'right' }}
                >
                    {onboardingComplete ? 'UNHIDE INTRO' : 'HIDE INTRO'}
                </Button>
                <Grid2
                    container
                    spacing={2}
                    sx={{ mt: 2, justifyContent: 'center' }}
                    display={onboardingComplete ? 'none' : 'flex'}
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
                            FilterScape.xyz makes it easy to customize a filter
                            for the loot-filters plugin.
                            <br />
                            It provides previews for your item labels, groups
                            configurations by item type, and more.
                            <br />
                            You can join the community of users of both the
                            site, and the plugin{' '}
                            <a href="https://discord.gg/ESbA28wPnt">
                                on discord
                            </a>
                            .
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
                            <a href="https://runelite.net/plugin-hub/show/loot-filters">
                                Loot Filters
                            </a>{' '}
                            is a replacement for the built-in Ground Items
                            plugin and supports a much more powerful set of
                            configuration options through its scriptable
                            filters.
                            <br />
                            The plugin lets you configure how and when items are
                            displayed based on many conditions like: if they are
                            noted, how many are in the stack, and even where you
                            are in the game world.
                            <br />
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
                            A filter is a script that controls how items are
                            displayed in the game. This website provides 2
                            built-in filters that you can configure and use
                            without any scripting.
                            <br />
                            You can also import a filter from a URL. This allows
                            you to customize and use other filters outside of
                            the 2 presets.
                            <br />
                        </Typography>
                    </Grid2>
                </Grid2>
            </Box>
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
                                sx={{
                                    color: 'text.secondary',
                                    minHeight: '4lh',
                                }}
                            >
                                An all in one filter for mains. Configurable
                                styling for most monsters and bosses.
                            </Typography>
                        </CardContent>
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
                            <Button
                                disabled={loading}
                                onClick={(e) => {
                                    e.preventDefault()
                                    loadFilter(FILTERSCAPE_FILTER)
                                }}
                            >
                                Import
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
                <Grid2 size={3}>
                    <Card variant="outlined">
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
                                    minHeight: '4lh',
                                }}
                            >
                                Goal is customizable styling for every item in
                                every context.
                            </Typography>
                        </CardContent>
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
                            <Button
                                onClick={(e) => {
                                    e.preventDefault()
                                    loadFilter(JOES_FILTER)
                                }}
                                disabled={loading}
                            >
                                Import
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
                <Grid2 size={3}>
                    <Card variant="outlined">
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
                                    minHeight: '4lh',
                                }}
                            >
                                Import a filter from a github url. Documentation
                                about writing and importing filters on the
                                website can be found{' '}
                                <a href="https://github.com/Kaqemeex/loot-filters-ui/tree/main/module-system-docs/modular-filters-book">
                                    on GitHub
                                </a>
                                .
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                onClick={(e) => {
                                    setShowURLImportOptions(true)
                                }}
                            >
                                Import
                            </Button>
                        </CardActions>
                    </Card>
                </Grid2>
                <Grid2 size={3}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography
                                variant="h6"
                                component="div"
                                fontSize="36px"
                            >
                                Create In UI
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: '24px',
                                    minHeight: '4lh',
                                }}
                            >
                                Write a filter right here in the UI.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                onClick={(e) => {
                                    const id = generateId()
                                    updateFilter(
                                        FilterSpec.parse({
                                            id: id,
                                            name: 'My new filter',
                                            rs2fHash: '',
                                            modules: [], // TODO add a module
                                            rs2f: '',
                                        })
                                    )
                                    navigate(
                                        `/editor/${id}?initialFile=filterRs2f`
                                    )
                                }}
                            >
                                Import
                            </Button>
                        </CardActions>
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
                            setLoading(true)
                            if (!filterUrl) {
                                setLoading(false)
                                setImportError('No filter URL provided')
                                return
                            }
                            createLink(
                                filterUrl,
                                DEFAULT_FILTER_CONFIGURATION
                            ).then((link) => {
                                window.location.href = link
                            })
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
        </div>
    )
}
