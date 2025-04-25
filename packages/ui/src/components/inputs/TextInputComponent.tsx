import { TextField, Typography } from '@mui/material'
import { FilterConfiguration, TextInput } from '../../parsing/UiTypesSpec'

export const TextInputComponent: React.FC<{
    input: TextInput
    config: FilterConfiguration
    onChange: (str: string) => void
    readonly: boolean
}> = ({ input, config, onChange, readonly }) => {
    const userConfigValue = config?.inputConfigs?.[input.macroName]
    const currentSetting = userConfigValue ?? input?.default

    return (
        <div>
            <Typography variant="h6" color="primary">
                {input.label}
            </Typography>
            <TextField
                disabled={readonly}
                value={currentSetting}
                onChange={(event) => {
                    const value = event.target.value
                    onChange(value)
                }}
                fullWidth
            />
        </div>
    )
}
