import { TextField } from '@mui/material'
import { FilterId, TextInput } from '../../parsing/UiTypesSpec'
import { useFilterConfigStore } from '../../store/storeV2'

export const TextInputComponent: React.FC<{
    activeFilterId: FilterId
    input: TextInput
}> = ({ activeFilterId, input }) => {
    const activeConfig = useFilterConfigStore(
        (state) => state.filterConfigurations[activeFilterId]
    )
    const updateInputConfiguration = useFilterConfigStore(
        (state) => state.updateInputConfiguration
    )

    const userConfigValue = activeConfig?.inputConfigs?.[input.macroName]
    const currentSetting = userConfigValue ?? input?.default

    return (
        <TextField
            value={currentSetting}
            onChange={(event) => {
                const value = event.target.value
                updateInputConfiguration(activeFilterId, input.macroName, value)
            }}
            fullWidth
        />
    )
}
