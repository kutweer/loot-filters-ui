import { Box, Tab, Tabs } from '@mui/material'
import { act, useMemo, useState } from 'react'
import { FilterSelector } from '../components/FilterSelector'
import { CustomizeTab } from '../components/tabs/CustomizeTab'
import { RenderedFilterTab } from '../components/tabs/RenderedFilterTab'
import { parse } from '../parsing/parse'
import { useFilterConfigStore } from '../store/filterConfigurationStore'
import { useFilterStore } from '../store/filterStore'

export const FilterTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0)

    const activeFilter = useFilterStore((state) =>
        Object.values(state.filters).find((filter) => filter.active)
    )

    const config = useFilterConfigStore((state) => {
        if (!activeFilter) return null
        return state.filterConfigurations[activeFilter.id] ?? null
    })

    const setFilterConfiguration = useFilterConfigStore(
        (state) => state.setFilterConfiguration
    )
    const clearConfiguration = useFilterConfigStore(
        (state) => state.clearConfiguration
    )
    const setEnabledModule = useFilterConfigStore(
        (state) => state.setEnabledModule
    )

    const prefixModules =
        parse(config?.prefixRs2f || '', false, {
            name: 'prefix',
        })?.filter?.modules || []

    const suffixModules =
        parse(config?.suffixRs2f || '', false, {
            name: 'suffix',
        })?.filter?.modules || []

    const tabs = useMemo(() => {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                    mt: 2,
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    aria-label="filter tabs"
                    sx={{ flex: 1 }}
                >
                    <Tab label="Customize" value={0} />
                    <Tab label="Preview" value={1} />
                </Tabs>
            </Box>
        )
    }, [activeTab, setActiveTab])
    return (
        <Box sx={{ mt: 3 }}>
            <Box>
                <FilterSelector />
            </Box>

            <Box sx={{ mt: 2 }}>
                {activeFilter && activeTab === 0 && (
                    <CustomizeTab
                        readonly={false}
                        extraComponent={tabs}
                        filter={activeFilter}
                        config={config}
                        onChange={(config) => {
                            setFilterConfiguration(activeFilter?.id, config)
                        }}
                        clearConfiguration={(filterId, macroNames) => {
                            clearConfiguration(filterId, macroNames)
                        }}
                        setEnabledModule={setEnabledModule}
                    />
                )}
                {activeFilter && activeTab === 1 && (
                    <RenderedFilterTab extraComponent={tabs} />
                )}
            </Box>
        </Box>
    )
}
