import { Box, Tab, Tabs, Typography } from "@mui/material"
import { LootGroupList } from "./LootGroupList"
import { Editor } from "@monaco-editor/react"
import { renderFilter } from "../templating/RenderFilters"
import { useState } from "react"
import { FilterConfig, LootGroup } from "../types/FilterTypes"
import useSiteConfig from "../utils/devmode"


export const FilterConfigComponent: React.FC<{
    configuration: FilterConfig
    setConfiguration: (updater: (prev: FilterConfig) => FilterConfig) => void
    sha: string
}> = ({ configuration, setConfiguration, sha }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleCreateGroup = (newGroup: LootGroup) => {
        setConfiguration((config: FilterConfig) => {
            const groups = [newGroup, ...config.lootGroups];
            return { ...configuration, lootGroups: groups };
        });
    };

    return (
        <Box sx={{ mt: 3, p: 2, borderRadius: 5 }}>
            <Box sx={{ borderBottom: 1, mb: 2 }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    aria-label="filter tabs"
                >
                    <Tab label="Filter Settings" />
                    <Tab label="Rendered Filter" />
                </Tabs>
            </Box>

            <Box sx={{ display: activeTab === 0 ? "block" : "none" }}>
                <LootGroupList
                    groups={configuration.lootGroups}
                    handleGroupUpdate={setConfiguration}
                    handleCreateGroup={handleCreateGroup}
                />
            </Box>

            <Box sx={{ display: activeTab === 1 ? "block" : "none" }}>
                <Typography color="text.secondary">
                    Copy and paste it for now.
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
                    value={renderFilter(configuration, sha)}
                />
            </Box>
        </Box>
    )
}