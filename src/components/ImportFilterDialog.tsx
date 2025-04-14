import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Dialog,
    DialogContent,
    Grid2,
    TextField,
    Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useOboardingStore } from '../store/onboarding'
import { useFilterStore } from '../store/storeV2'
import { loadFilterFromUrl } from '../utils/loaderv2'

interface ImportFilterDialogProps {
    open: boolean
    onClose: () => void
}

const FILTERSCAPE_FILTER =
    'https://raw.githubusercontent.com/riktenx/filterscape/refs/heads/migrate/filterscape.rs2f'
const JOES_FILTER =
    'https://github.com/typical-whack/loot-filters-modules/blob/migrate/filter.rs2f'

export const ImportFilterDialog: React.FC<ImportFilterDialogProps> = ({
    open,
    onClose,
}) => {
    const [filterUrl, setFilterUrl] = useState('')
    const [filterNameOverride, setFilterNameOverride] = useState('')
    const [importError, setImportError] = useState('')
    const { updateFilter, setActiveFilter } = useFilterStore()

    const handleClose = () => {
        setFilterUrl('')
        setFilterNameOverride('')
        setShowURLImportOptions(false)
        setLoading(false)
        onClose()
    }

    const [loading, setLoading] = useState(false)
    const [showURLImportOptions, setShowURLImportOptions] = useState(false)
    const { onboardingComplete, setOnboardingComplete } = useOboardingStore()

    return (
        <Dialog fullWidth maxWidth="xl" open={open} onClose={handleClose}>
            <DialogContent>
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
                                <p>
                                    FilterScape.xyz makes it easy to customize a
                                    filter for the loot-filters plugin.
                                </p>
                                <p>
                                    It provides previews for your item labels,
                                    groups configurations by item type, and
                                    more.
                                </p>
                                <p>
                                    You can join the community of users of both
                                    the site, and the plugin{' '}
                                    <a href="https://discord.gg/ESbA28wPnt">
                                        on discord
                                    </a>
                                    .
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
                                    is a replacement for the built-in Ground
                                    Items plugin and supports a much more
                                    powerful set of configuration options
                                    through its scriptable filters.
                                </p>

                                <p>
                                    The plugin lets you configure how and when
                                    items are displayed based on many conditions
                                    like: if they are noted, how many are in the
                                    stack, and even where you are in the game
                                    world.
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
                                    A filter is a script that controls how items
                                    are displayed in the game. This website
                                    provides 2 built-in filters that you can
                                    configure and use without any scripting.
                                </p>
                                <p>
                                    You can also import a filter from a URL.
                                    This allows you to customize and use other
                                    filters outside of the 2 presets.
                                </p>
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
                                        setLoading(true)
                                        loadFilterFromUrl(FILTERSCAPE_FILTER)
                                            .then((filter) => {
                                                if (filter) {
                                                    updateFilter(filter)
                                                    setActiveFilter(filter.id)
                                                    handleClose()
                                                }
                                            })
                                            .catch((error) => {
                                                setImportError(error.message)
                                            })
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
                    <Grid2 size={1} />
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
                                    Goal is customizable styling for every item
                                    in every context.
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
                                        setLoading(true)
                                        loadFilterFromUrl(JOES_FILTER)
                                            .then((filter) => {
                                                if (filter) {
                                                    updateFilter(filter)
                                                    setActiveFilter(filter.id)
                                                    handleClose()
                                                }
                                            })
                                            .catch((error) => {
                                                setImportError(error.message)
                                            })
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
                    <Grid2 size={1} />
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
                                    Import a filter from a pastebin or github
                                    url. Documentation about writing and
                                    importing filters on the website can be
                                    found{' '}
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
                                setLoading(true)
                                loadFilterFromUrl(filterUrl)
                                    .then((filter) => {
                                        if (filter) {
                                            updateFilter(filter)
                                            setActiveFilter(filter.id)
                                            handleClose()
                                        }
                                    })
                                    .catch((error) => {
                                        setImportError(error.message)
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
            </DialogContent>
        </Dialog>
    )
}
