import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { colors } from '../styles/MuiTheme'
import { useTheme } from '@mui/material';

export const GitHubFlavoredMarkdown = ({ gfmd }: { gfmd: string }) => {
    const theme = useTheme();

    return (
        <span
            style={{
                color: colors.rsLightestBrown,
                marginLeft: '1em',
                display: 'inline-block',
                fontSize: theme.typography.h6.fontSize,
            }}
        >
            <Markdown remarkPlugins={[remarkGfm]}>{gfmd}</Markdown>
        </span>
    )
}
