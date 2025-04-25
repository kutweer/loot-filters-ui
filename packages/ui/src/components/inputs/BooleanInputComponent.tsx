import { Checkbox, Typography } from '@mui/material'
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
        config?.inputConfigs?.[input.macroName] ?? input.default
    )

    return (
        <div>
            <Typography variant="h6" color="primary">
                {input.label}
            </Typography>
            <Checkbox
                disabled={readonly}
                checked={currentSetting}
                onChange={(event) => {
                    const value = event.target.checked
                    onChange(value)
                }}
            />
        </div>
    )
}
