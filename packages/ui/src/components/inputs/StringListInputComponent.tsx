import { ContentPaste, CopyAll } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import {
    FilterConfiguration,
    ListDiff,
    ListDiffSpec,
    ListOption,
    StringListInput,
} from '../../parsing/UiTypesSpec'
import { useSettingsCopyStore } from '../../store/settingsCopyStore'
import { colors } from '../../styles/MuiTheme'
import {
    applyDiff,
    convertToListDiff,
    EMPTY_DIFF,
} from '../../utils/ListDiffUtils'
import { SmartTooltip } from '../SmartTooltip'
import { Option, UISelect } from './UISelect'
import { useAlertStore } from '../../store/alerts'

export const StringListInputComponent: React.FC<{
    input: StringListInput
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
    const canPaste =
        copiedInput?.type === 'stringlist' && pasteableConfig !== null

    const currentValues = applyDiff(input.default, configuredDiff)

    const options: Option[] = input.default.map(
        (option: string | ListOption) => {
            if (typeof option === 'string') {
                return {
                    label: option,
                    value: option,
                }
            }
            return option
        }
    )

    return (
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <UISelect
                disabled={readonly}
                options={options}
                label={input.label}
                multiple={true}
                freeSolo={true}
                value={currentValues.map((value: string | ListOption) => {
                    if (typeof value === 'string') {
                        const found = options.find((o) => o.value === value)
                        if (found) {
                            return found
                        }
                        return {
                            label: value,
                            value: value,
                        }
                    }
                    return value
                })}
                onChange={(newValue) => {
                    const values = ((newValue as Option[]) || []).map(
                        (option) => option.value
                    )
                    onChange(convertToListDiff(values, input.default))
                }}
            />
            <SmartTooltip
                enabledTitle="Copy list settings to clipboard"
                disabledTitle="No string list settings selected"
                enabled={canPaste}
            >
                <IconButton
                    disabled={!canPaste}
                    onClick={(e) => {
                        e.stopPropagation()
                        onChange(pasteableConfig)
                    }}
                >
                    <ContentPaste
                        sx={{
                            color:
                                copiedInput?.type !== 'stringlist' ||
                                pasteableConfig === null
                                    ? 'grey'
                                    : colors.rsOrange,
                        }}
                    />
                </IconButton>
            </SmartTooltip>
            <SmartTooltip
                enabledTitle="Copy list settings to clipboard"
                disabledTitle=""
                enabled={true}
            >
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation()
                        setSettingsCopy(input, configuredDiff)
                        addAlert({
                            children:
                                'String list settings copied to clipboard',
                            severity: 'success',
                        })
                    }}
                >
                    <CopyAll sx={{ color: colors.rsOrange }} />
                </IconButton>
            </SmartTooltip>
        </div>
    )
}
