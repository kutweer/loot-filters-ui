import { Checkbox } from '@mui/material'
import {
    BooleanInput,
    BooleanInputDefaultSpec,
    FilterId,
} from '../../parsing/UiTypesSpec'
import { useFilterConfigStore } from '../../store/storeV2'

export const BooleanInputComponent: React.FC<{
    activeFilterId: FilterId
    input: BooleanInput
}> = ({ activeFilterId, input }) => {
    const activeConfig = useFilterConfigStore(
        (state) => state.filterConfigurations[activeFilterId]
    )
    const updateInputConfiguration = useFilterConfigStore(
        (state) => state.updateInputConfiguration
    )

    const currentSetting = BooleanInputDefaultSpec.parse(
        activeConfig?.inputConfigs?.[input.macroName]
    )

    return (
        <Checkbox
            checked={currentSetting}
            onChange={(event) => {
                const value = event.target.checked
                updateInputConfiguration(activeFilterId, input.macroName, value)
            }}
        />
    )
}
