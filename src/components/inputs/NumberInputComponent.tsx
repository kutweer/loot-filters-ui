import { TextField } from '@mui/material'
import {
    FilterId,
    NumberInput,
    NumberInputDefaultSpec,
} from '../../parsing/UiTypesSpec'
import { useFilterConfigStore } from '../../store/filterConfigurationStore'

export const NumberInputComponent: React.FC<{
    activeFilterId: FilterId
    input: NumberInput
}> = ({ activeFilterId, input }) => {
    const activeConfigValue = useFilterConfigStore(
        (state) =>
            state.filterConfigurations[activeFilterId]?.inputConfigs?.[
                input.macroName
            ]
    )

    const updateInputConfiguration = useFilterConfigStore(
        (state) => state.updateInputConfiguration
    )

    const userConfigValue =
        activeConfigValue || activeConfigValue === 0
            ? NumberInputDefaultSpec.optional().parse(activeConfigValue)
            : undefined

    const currentSetting = userConfigValue ?? input.default

    return (
        <TextField
            type="number"
            value={currentSetting}
            onChange={(event) => {
                const value = event.target.value
                updateInputConfiguration(
                    activeFilterId,
                    input.macroName,
                    parseInt(value)
                )
            }}
        />
    )
}
