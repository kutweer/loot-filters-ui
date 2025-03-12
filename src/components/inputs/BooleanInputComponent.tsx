import { Checkbox } from '@mui/material'
import { useUiStore } from '../../store/store'
import { BooleanInput } from '../../types/InputsSpec'
import {
    FilterId,
    ModularFilterConfiguration,
    UiFilterModule,
} from '../../types/ModularFilterSpec'

export const BooleanInputComponent: React.FC<{
    activeFilterId: FilterId
    module: UiFilterModule
    input: BooleanInput
}> = ({ activeFilterId, module, input }) => {
    const activeConfig: ModularFilterConfiguration = useUiStore(
        (state) => state.filterConfigurations[activeFilterId]
    )
    const setFilterConfiguration = useUiStore(
        (state) => state.setFilterConfiguration
    )

    const currentSetting =
        (activeConfig?.[module.id]?.[input.macroName] as boolean | undefined) ??
        input.default ??
        false

    return (
        <Checkbox
            checked={currentSetting}
            onChange={(event) => {
                const value = event.target.checked
                setFilterConfiguration(
                    activeFilterId,
                    module.id,
                    input.macroName,
                    value
                )
            }}
        />
    )
}
