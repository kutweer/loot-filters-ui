import { TextField } from '@mui/material'
import { useUiStore } from '../../store/store'
import { TextInput } from '../../types/InputsSpec'
import { FilterId, UiFilterModule } from '../../types/ModularFilterSpec'

export const TextInputComponent: React.FC<{
    activeFilterId: FilterId
    module: UiFilterModule
    input: TextInput
}> = ({ activeFilterId, module, input }) => {
    const activeConfig = useUiStore(
        (state) => state.filterConfigurations[activeFilterId]
    )
    const setFilterConfiguration = useUiStore(
        (state) => state.setFilterConfiguration
    )

    const userConfigValue = activeConfig?.inputConfigs?.[input.macroName]
    const currentSetting = userConfigValue ?? input?.default

    return (
        <TextField
            value={currentSetting}
            onChange={(event) => {
                const value = event.target.value
                setFilterConfiguration(activeFilterId, input.macroName, value)
            }}
            fullWidth
        />
    )
}
