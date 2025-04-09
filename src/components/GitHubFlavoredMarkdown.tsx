import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { colors } from '../styles/MuiTheme'

export const GitHubFlavoredMarkdown = ({ gfmd }: { gfmd: string }) => {
    return (
        <div
            style={{
                color: colors.rsLightestBrown,
            }}
        >
            <Markdown remarkPlugins={[remarkGfm]}>{gfmd}</Markdown>
        </div>
    )
}
