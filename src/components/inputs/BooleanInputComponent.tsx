import { Checkbox } from '@mui/material'
import {
    BooleanInput,
    BooleanInputDefaultSpec,
    FilterConfiguration,
} from '../../parsing/UiTypesSpec'

export const BooleanInputComponent: React.FC<{
    input: BooleanInput
    config: FilterConfiguration
    onChange: (boolean: boolean) => void
    readonly: boolean
}> = ({ input, config, onChange, readonly }) => {
    const currentSetting = BooleanInputDefaultSpec.parse(
        config?.inputConfigs?.[input.macroName]
    )

    return (
        <Checkbox
            disabled={readonly}
            checked={currentSetting}
            onChange={(event) => {
                const value = event.target.checked
                onChange(value)
            }}
        />
    )
}
