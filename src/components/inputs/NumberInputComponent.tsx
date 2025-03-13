import { TextField } from '@mui/material'
import { useUiStore } from '../../store/store'
import { NumberInput } from '../../types/InputsSpec'
import { FilterId, UiFilterModule } from '../../types/ModularFilterSpec'

export const NumberInputComponent: React.FC<{
    activeFilterId: FilterId
    module: UiFilterModule
    input: NumberInput
}> = ({ activeFilterId, module, input }) => {
    const activeConfig = useUiStore(
        (state) => state.filterConfigurations[activeFilterId]
    )
    const setFilterConfiguration = useUiStore(
        (state) => state.setFilterConfiguration
    )

    const userConfigValue =
        activeConfig?.inputConfigs?.[input.macroName] ?? input.default
    const currentSetting = userConfigValue ?? input.default

    return (
        <TextField
            type="number"
            value={currentSetting}
            onChange={(event) => {
                const value = event.target.value
                setFilterConfiguration(
                    activeFilterId,
                    input.macroName,
                    parseInt(value)
                )
            }}
        />
    )
}
