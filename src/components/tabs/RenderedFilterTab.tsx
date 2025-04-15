import { Editor } from '@monaco-editor/react'
import { useFilterConfigStore } from '../../store/filterConfigurationStore'
import { useFilterStore } from '../../store/filterStore'
import { renderFilter } from '../../utils/render'
const RenderFilterComponent: React.FC = () => {
    const activeFilter = useFilterStore((state) =>
        Object.values(state.filters).find((f) => f.active)
    )
    const activeConfig = useFilterConfigStore((state) =>
        activeFilter ? state.filterConfigurations[activeFilter.id] : undefined
    )

    return (
        <>
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

export const RenderedFilterTab: React.FC = () => {
    return <RenderFilterComponent />
}
