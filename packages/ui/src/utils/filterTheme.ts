import { ThemeSpec } from '../parsing/FilterTypesSpec'
import { FilterConfiguration } from '../parsing/UiTypesSpec'
import { generateId } from './idgen'
import yaml from 'yaml'

export const toThemeStructuredComment = (
    name: string,
    config: FilterConfiguration,
    subtitle?: string,
    description?: string
): string => {
    const theme = ThemeSpec.parse({
        name,
        subtitle,
        description,
        config: {
            enabledModules: config.enabledModules,
            inputConfigs: config.inputConfigs,
        },
    })

    return `/*@ define:theme:${generateId()}\n${yaml.stringify(theme)}*/\n`
}
