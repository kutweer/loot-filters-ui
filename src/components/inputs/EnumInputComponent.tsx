import { useUiStore } from '../../store/store'
import { EnumListInput, ListDiff } from '../../types/InputsSpec'
import { FilterId, UiFilterModule } from '../../types/ModularFilterSpec'
import { applyDiff, convertToListDiff } from '../../utils/ListDiffUtils'
import { Option, UISelect } from './UISelect'

export const EnumInputComponent: React.FC<{
    activeFilterId: FilterId
    module: UiFilterModule
    input: EnumListInput
}> = ({ activeFilterId, module, input }) => {
    const activeConfig = useUiStore(
        (state) => state.filterConfigurations[activeFilterId]
    )
    const setFilterConfiguration = useUiStore(
        (state) => state.setFilterConfiguration
    )

    const configuredDiff = activeConfig?.inputConfigs?.[input.macroName] as
        | ListDiff
        | undefined

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
                setFilterConfiguration(
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
