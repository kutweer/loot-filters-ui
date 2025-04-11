import {
    Box,
    FormControl,
    FormControlLabel,
    FormGroup,
    Link,
    Switch,
    Typography,
} from '@mui/material'
import { useUiStore } from '../store/store'
import { colors } from '../styles/MuiTheme'

export const AppHeader: React.FC = () => {
    const { siteConfig, setSiteConfig } = useUiStore()
    let buildInfo = { gitSha: 'main' }
    try {
        buildInfo = require('../build-info.json')
    } catch {
        console.warn('Could not load build info, using default')
    }
    return (
        <Box>
            <Box
                sx={{
                    padding: 1,
                    display: 'flex',
                }}
            >
                <Typography variant="h4" color="primary">
                    Loot Filter Builder
                    <Typography
                        sx={{ paddingLeft: '1em', display: 'inline-block' }}
                        gutterBottom
                    >
                        <span style={{ color: colors.rsYellow }}>
                            A LootFilter builder for{' '}
                            <Link
                                style={{
                                    color: colors.rsYellow,
                                    textDecorationColor: colors.rsYellow,
                                }}
                                target="_blank"
                                href="https://github.com/riktenx/loot-filters"
                            >
                                RuneLite Loot Filters
                            </Link>
                        </span>
                    </Typography>
                </Typography>
                {siteConfig.isLocal ? (
                    <FormControl sx={{ marginLeft: 'auto' }}>
                        <FormGroup>
                            <FormControlLabel
                                sx={{ color: colors.rsYellow }}
                                control={
                                    <Switch checked={siteConfig.devMode} />
                                }
                                onChange={(_, checked: boolean) =>
                                    setSiteConfig({
                                        ...siteConfig,
                                        devMode: checked,
                                    })
                                }
                                label="Dev Mode"
                            />
                        </FormGroup>
                    </FormControl>
                ) : null}
                <Typography
                    sx={{ marginLeft: 'auto' }}
                    variant="body2"
                    color="text.secondary"
                >
                    version: {buildInfo.gitSha.slice(0, 7)}
                </Typography>
            </Box>
        </Box>
    )
}
