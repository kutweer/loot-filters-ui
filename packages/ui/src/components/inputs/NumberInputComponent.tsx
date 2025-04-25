import { TextField } from '@mui/material'
import {
    FilterConfiguration,
    NumberInput,
    NumberInputDefaultSpec,
} from '../../parsing/UiTypesSpec'

export const NumberInputComponent: React.FC<{
    config: FilterConfiguration
    input: NumberInput
    readonly: boolean
    onChange: (number: number) => void
}> = ({ config, input, readonly, onChange }) => {
    const activeConfigValue = config?.inputConfigs?.[input.macroName]
    const userConfigValue =
        activeConfigValue || activeConfigValue === 0
            ? NumberInputDefaultSpec.optional().parse(activeConfigValue)
            : undefined

    const currentSetting = userConfigValue ?? input.default

    return (
        <TextField
            disabled={readonly}
            type="number"
            value={currentSetting}
            onChange={(event) => {
                const value = event.target.value
                onChange(parseInt(value))
            }}
        />
    )
}
