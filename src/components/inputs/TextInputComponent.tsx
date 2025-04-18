import { TextField } from '@mui/material'
import { TextInput, FilterConfiguration } from '../../parsing/UiTypesSpec'

export const TextInputComponent: React.FC<{
    input: TextInput
    config: FilterConfiguration
    onChange: (str: string) => void
    readonly: boolean
}> = ({ input, config, onChange, readonly }) => {
    const userConfigValue = config?.inputConfigs?.[input.macroName]
    const currentSetting = userConfigValue ?? input?.default

    return (
        <TextField
            disabled={readonly}
            value={currentSetting}
            onChange={(event) => {
                const value = event.target.value
                onChange(value)
            }}
            fullWidth
        />
    )
}
