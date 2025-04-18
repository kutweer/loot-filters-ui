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
    console.log('boolean input', input, 'config', config)

    const currentSetting = BooleanInputDefaultSpec.parse(
        config?.inputConfigs?.[input.macroName] ?? input.default
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
