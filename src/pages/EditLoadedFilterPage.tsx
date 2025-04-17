import { FormControlLabel, Switch, Typography } from '@mui/material'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { Rs2fEditor } from '../components/Rs2fEditor'
import { parseModules } from '../parsing/parse'
import { FilterConfiguration } from '../parsing/UiTypesSpec'
import { useFilterConfigStore } from '../store/filterConfigurationStore'
import { useFilterStore } from '../store/filterStore'
import { colors } from '../styles/MuiTheme'
import { applyModule } from '../utils/render'

const DOC_LINK_COMMENT =
    '// For docs visit https://github.com/Kaqemeex/loot-filters-ui/blob/main/module-system-docs/modular-filters-book/Readme.md'

const raise = (error: Error) => {
    throw error
}

export const EditorLoadedFilterPage: React.FC = () => {
    const { filterId } = useParams()
    const { filterConfigurations, setFilterConfiguration } =
        useFilterConfigStore()
    const { filters, updateFilter } = useFilterStore()
    const [editDefaults, setEditDefaults] = useState<boolean>(false)

    if (!filterId || !filters[filterId]) {
        return (
            <ErrorBoundary
                error={new Error(`Filter with id ${filterId} not found.`)}
            >
                <div>No filter id</div>
            </ErrorBoundary>
        )
    }

    const config = filterConfigurations[filterId]

    const defaultContent = {
        prefixRs2f:
            '/*@ define:module:prefix\nname: A Prefix Module\n*/\n' +
            DOC_LINK_COMMENT,
        suffixRs2f:
            '/*@ define:module:suffix\nname: A Suffix Module\n*/\n' +
            DOC_LINK_COMMENT,
    }

    const filesContent = {
        ...defaultContent,
        ...(config?.prefixRs2f ? { prefixRs2f: config.prefixRs2f } : {}),
        ...(config?.suffixRs2f ? { suffixRs2f: config.suffixRs2f } : {}),
        ...(filters[filterId] ? { filterRs2f: filters[filterId].rs2f } : {}),
    }

    const [selected, setSelected] = useState<
        'filterRs2f' | 'prefixRs2f' | 'suffixRs2f'
    >('prefixRs2f')
    const setContent = (id: string, content: string) => {
        if (id === 'filterRs2f') {
            updateFilter({
                ...filters[filterId],
                rs2f: content,
            })
        } else if (id === 'prefixRs2f' || id === 'suffixRs2f') {
            setFilterConfiguration(filterId, {
                ...config,
                [id]: content,
            })
        } else {
            // nothing
        }
    }

    return (
        <Rs2fEditor
            selected={selected}
            setEditorContent={setContent}
            setSelected={setSelected as (selected: string | null) => void}
            filesContent={filesContent}
            allowEditDefaults={editDefaults}
            configClearConfiguration={() => {
                console.log('clear')
            }}
            configSetEnabledModule={() => {
                console.log('set enabled module')
            }}
            configOnChange={(config: FilterConfiguration) => {
                console.log('config', config)
                const content: string | undefined = filesContent[selected!!]
                if (!content) {
                    return
                }
                const maybeModules = parseModules(content)
                if (maybeModules.modules) {
                    const newContent = maybeModules.modules
                        .map((m) => {
                            return applyModule(m, config.inputConfigs)
                        })
                        .join('\n\n')
                    console.log('newContent', newContent)

                    setContent(selected, newContent)
                }
            }}
            extraTabComponent={
                <div>
                    <FormControlLabel
                        sx={{ color: colors.rsYellow }}
                        control={<Switch checked={editDefaults} />}
                        onChange={(_, checked: boolean) =>
                            setEditDefaults(checked)
                        }
                        label="Edit Defaults"
                    />
                    <Typography variant="h5" color="error">
                        {selected === 'filterRs2f' && filters[filterId].source
                            ? 'Warning: Changes will not be carried forward when filter updates'
                            : null}
                    </Typography>
                </div>
            }
            options={[
                { label: 'Prefix', value: 'prefixRs2f' },
                { label: 'Filter', value: 'filterRs2f' },
                { label: 'Suffix', value: 'suffixRs2f' },
            ]}
        />
    )
}
