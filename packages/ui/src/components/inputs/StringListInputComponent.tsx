import {
    FilterConfiguration,
    ListDiff,
    ListDiffSpec,
    ListOption,
    StringListInput,
} from '../../parsing/UiTypesSpec'
import {
    applyDiff,
    convertToListDiff,
    EMPTY_DIFF,
} from '../../utils/ListDiffUtils'
import { CopyInputSettings } from './CopyInputSettings'
import { Option, UISelect } from './UISelect'

export const StringListInputComponent: React.FC<{
    input: StringListInput
    config: FilterConfiguration
    onChange: (diff: ListDiff) => void
    readonly: boolean
}> = ({ input, config, onChange, readonly }) => {
    const configuredDiff = ListDiffSpec.optional()
        .default(EMPTY_DIFF)
        .parse(config?.inputConfigs?.[input.macroName])

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
            <CopyInputSettings
                input={input}
                configToCopy={currentValues}
                onChange={onChange}
            />
        </div>
    )
}
