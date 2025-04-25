import { ContentPaste, CopyAll } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import {
    EnumListInput,
    FilterConfiguration,
    ListDiff,
    ListDiffSpec,
} from '../../parsing/UiTypesSpec'
import { useAlertStore } from '../../store/alerts'
import { useSettingsCopyStore } from '../../store/settingsCopyStore'
import { colors } from '../../styles/MuiTheme'
import {
    applyDiff,
    convertToListDiff,
    EMPTY_DIFF,
} from '../../utils/ListDiffUtils'
import { SmartTooltip } from '../SmartTooltip'
import { Option, UISelect } from './UISelect'
import { CopyInputSettings } from './CopyInputSettings'

export const EnumInputComponent: React.FC<{
    input: EnumListInput
    config: FilterConfiguration
    onChange: (diff: ListDiff) => void
    readonly: boolean
}> = ({ input, config, onChange, readonly }) => {
    const configuredDiff = ListDiffSpec.optional()
        .default(EMPTY_DIFF)
        .parse(config?.inputConfigs?.[input.macroName])
    const { copiedInput, pasteableConfig, setSettingsCopy } =
        useSettingsCopyStore()
    const { addAlert } = useAlertStore()

    const currentSetting = applyDiff(input.default, configuredDiff)

    const options: Option<string>[] = input.enum.map((enumValue) => {
        if (typeof enumValue === 'string') {
            return {
                label: enumValue,
                value: enumValue,
            }
        }
        return enumValue
    })

    const selectedOptions = Array.isArray(currentSetting)
        ? currentSetting
              .filter((value): value is string => typeof value === 'string')
              .map((value) => {
                  const found = options.find((o) => o.value === value)
                  if (found) {
                      return found
                  }
                  return {
                      label: value,
                      value: value,
                  }
              })
        : []

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <UISelect<string>
                disabled={readonly}
                options={options}
                value={selectedOptions}
                onChange={(newValue: Option<string>[] | null) => {
                    onChange(
                        convertToListDiff(
                            newValue
                                ? newValue.map((option) => option.value)
                                : [],
                            input.default
                        )
                    )
                }}
                multiple
                label="Select options"
            />

            <CopyInputSettings
                input={input}
                configToCopy={currentSetting.map((v) => {
                    if (typeof v === 'string') {
                        return v
                    }
                    return v.value
                })}
                onChange={onChange}
            />
        </div>
    )
}
