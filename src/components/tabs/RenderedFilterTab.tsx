import { Editor } from '@monaco-editor/react'
import { Typography } from '@mui/material'
import { useUiStore } from '../../store/store'
import { renderFilter } from '../../utils/render'

const RenderFilterComponent: React.FC = () => {
    const activeFilter = useUiStore((state) =>
        Object.values(state.importedModularFilters).find((f) => f.active)
    )
    const activeConfig = useUiStore((state) =>
        activeFilter ? state.filterConfigurations[activeFilter.id] : undefined
    )

    return (
        <>
            <Typography color="text.secondary">
                Copy and paste into a file named{' '}
                <span
                    style={{
                        color: 'white',
                        fontSize: '16px',
                    }}
                >
                    {activeFilter?.name.replace(/[\s\/]/g, '_')}.rs2f
                </span>{' '}
                in{' '}
                <span style={{ color: 'white', fontSize: '16px' }}>
                    .runelite/loot-filters/filters
                </span>
                .
            </Typography>

            <Editor
                height="70vh"
                language="cpp"
                theme="vs-dark"
                options={{
                    minimap: {
                        enabled: false,
                    },
                    readOnly: true,
                }}
                value={
                    activeFilter
                        ? renderFilter(activeFilter, activeConfig)
                        : 'no filter selected'
                }
            />
        </>
    )
}

export const RenderedFilterTab: React.FC<{
    sha: string
}> = ({ sha }) => {
    return <RenderFilterComponent />
}
