import {
    FilterId,
    ListDiffSpec,
    ListOption,
    StringListInput,
} from '../../parsing/UiTypesSpec'
import { useFilterConfigStore } from '../../store/filterConfigurationStore'
import {
    applyDiff,
    convertToListDiff,
    EMPTY_DIFF,
} from '../../utils/ListDiffUtils'
import { Option, UISelect } from './UISelect'

export const StringListInputComponent: React.FC<{
    activeFilterId: FilterId
    input: StringListInput
}> = ({ activeFilterId, input }) => {
    const updateInputConfiguration = useFilterConfigStore(
        (state) => state.updateInputConfiguration
    )

    const activeConfig = useFilterConfigStore(
        (state) => state.filterConfigurations[activeFilterId]
    )

    const configuredDiff = ListDiffSpec.optional()
        .default(EMPTY_DIFF)
        .parse(activeConfig?.inputConfigs?.[input.macroName])

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
        <UISelect
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
                updateInputConfiguration(
                    activeFilterId,
                    input.macroName,
                    convertToListDiff(values, input.default)
                )
            }}
        />
    )
}
