import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { colors } from '../styles/MuiTheme'

export const GitHubFlavoredMarkdown = ({ gfmd }: { gfmd: string }) => {
    return (
        <span
            style={{
                color: colors.rsLightestBrown,
                marginLeft: '1em',
                display: 'inline-block',
            }}
        >
            <Markdown remarkPlugins={[remarkGfm]}>{gfmd}</Markdown>
        </span>
    )
}
