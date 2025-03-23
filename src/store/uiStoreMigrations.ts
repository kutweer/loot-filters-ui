import {
    EnumListInput,
    IncludeExcludeListInput,
    Input,
    InputConfig,
    MacroName,
    StringListInput,
} from '../types/InputsSpec'
import {
    FilterId,
    ModularFilterConfigurationV2,
} from '../types/ModularFilterSpec'
import { convertToListDiff } from '../utils/ListDiffUtils'
import {
    DeleteFilterSlice,
    FilterConfigurationSlice,
    ImportedFilterSlice,
    SiteConfigSlice,
} from './store'

type V0PersistedState = Pick<SiteConfigSlice, 'siteConfig'> &
    Pick<ImportedFilterSlice, 'importedModularFilters'> &
    Pick<FilterConfigurationSlice, 'filterConfigurations'> &
    Pick<DeleteFilterSlice, 'deleteFilter'>

type V1PersistedState = Pick<SiteConfigSlice, 'siteConfig'> &
    Pick<ImportedFilterSlice, 'importedModularFilters'> & {
        filterConfigurations: {
            [key: FilterId]: ModularFilterConfigurationV2
        }
    }

type V2PersistedState = Pick<SiteConfigSlice, 'siteConfig'> &
    ImportedFilterSlice & {
        filterConfigurations: {
            [key: FilterId]: ModularFilterConfigurationV2
        }
    }

const v0toV1Migration = (
    persistedState: V0PersistedState
): V1PersistedState => {
    console.log('Migrating v0 to v1', persistedState)

    const newState = {
        ...persistedState,
        filterConfigurations: {},
    }

    Object.entries(persistedState.filterConfigurations).forEach(
        ([filterId, config]) => {
            const enabledModules = Object.entries(config)
                .filter(([_, macros]) => {
                    return macros.enabled
                })
                .map(([moduleId]) => moduleId)

            const inputConfigs: {
                [key: MacroName]: InputConfig<Input>
            }[] = Object.values(config).map((macros) => {
                return Object.entries(macros)
                    .map(
                        ([macroName, data]: [
                            MacroName,
                            InputConfig<Input>,
                        ]) => {
                            return {
                                [macroName]: data,
                            }
                        }
                    )
                    .reduce((acc, curr) => {
                        return { ...acc, ...curr }
                    }, {})
            })

            ;(newState as V1PersistedState).filterConfigurations[filterId] = {
                enabledModules,
                inputConfigs: inputConfigs.reduce((acc, curr) => {
                    return { ...acc, ...curr }
                }, {}),
            } as unknown as ModularFilterConfigurationV2
        }
    )

    return newState as V1PersistedState
}

const v1toV2Migration = (
    persistedState: V1PersistedState
): V2PersistedState => {
    console.log('Migrating v1 to v2', persistedState)
    const persistedInputConfigs = persistedState.importedModularFilters

    const newInputConfigs = Object.entries(
        persistedState.filterConfigurations
    ).map(([filterId, config]) => {
        const newConfig = Object.entries(config.inputConfigs).map(
            ([macroName, config]) => {
                if (Array.isArray(config)) {
                    const input = persistedInputConfigs[filterId].modules
                        .map((module) => module.inputs)
                        .flat()
                        .find((input) => {
                            return (
                                input.macroName === macroName ||
                                Object.values(input.macroName).includes(
                                    macroName
                                )
                            )
                        }) as
                        | StringListInput
                        | EnumListInput
                        | IncludeExcludeListInput

                    const listDiff =
                        input.type === 'stringlist' || input.type === 'enumlist'
                            ? convertToListDiff(
                                  config as string[],
                                  input.default
                              )
                            : convertToListDiff(
                                  config as string[],
                                  input.macroName.includes === macroName
                                      ? input.default.includes
                                      : input.default.excludes
                              )

                    return [macroName, listDiff]
                }
                return [macroName, config]
            }
        )
        return [
            filterId,
            {
                ...config,
                inputConfigs: Object.fromEntries(newConfig),
            },
        ]
    })

    return {
        ...persistedState,
        filterConfigurations: {
            ...Object.fromEntries(newInputConfigs),
        },
    } as unknown as V2PersistedState
}

export const migrate = (
    persistedState: unknown,
    version: number
): V1PersistedState => {
    let state = persistedState as any
    try {
        if (version <= 0) {
            state = v0toV1Migration(
                persistedState as unknown as V0PersistedState
            )
        }
        if (version <= 1) {
            state = v1toV2Migration(
                persistedState as unknown as V1PersistedState
            )
        }
    } catch (e) {
        console.error('Error migrating', e)
        throw e
    }

    return state as V1PersistedState
}
