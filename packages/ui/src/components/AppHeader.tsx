import {
    Box,
    FormControl,
    FormControlLabel,
    FormGroup,
    Link,
    Switch,
    Typography,
} from '@mui/material'
import { colors } from '../styles/MuiTheme'

export const AppHeader: React.FC = () => {
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
                    FilterScape.xyz
                    <Typography
                        sx={{ paddingLeft: '1em', display: 'inline-block' }}
                        gutterBottom
                    >
                        <span style={{ color: colors.rsYellow }}>
                            A LootFilter configuration tool for{' '}
                            <Link
                                style={{
                                    color: colors.rsYellow,
                                    textDecorationColor: colors.rsYellow,
                                }}
                                target="_blank"
                                href="https://runelite.net/plugin-hub/show/loot-filters"
                            >
                                RuneLite Loot Filters
                            </Link>
                        </span>
                    </Typography>
                </Typography>
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
