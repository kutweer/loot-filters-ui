import {
    EnumListInput,
    FilterId,
    ListDiffSpec,
} from '../../parsing/UiTypesSpec'
import { useFilterConfigStore } from '../../store/filterConfigurationStore'
import {
    applyDiff,
    convertToListDiff,
    EMPTY_DIFF,
} from '../../utils/ListDiffUtils'
import { Option, UISelect } from './UISelect'

export const EnumInputComponent: React.FC<{
    activeFilterId: FilterId
    input: EnumListInput
}> = ({ activeFilterId, input }) => {
    const activeConfig = useFilterConfigStore(
        (state) => state.filterConfigurations[activeFilterId]
    )
    const updateInputConfiguration = useFilterConfigStore(
        (state) => state.updateInputConfiguration
    )

    const configuredDiff = ListDiffSpec.optional()
        .default(EMPTY_DIFF)
        .parse(activeConfig?.inputConfigs?.[input.macroName])

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
        <UISelect<string>
            options={options}
            value={selectedOptions}
            onChange={(newValue: Option<string>[] | null) => {
                updateInputConfiguration(
                    activeFilterId,
                    input.macroName,
                    convertToListDiff(
                        newValue ? newValue.map((option) => option.value) : [],
                        input.default
                    )
                )
            }}
            multiple
            label="Select options"
        />
    )
}
