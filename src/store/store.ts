import { mapObject } from 'underscore'
import { create, StateCreator, StoreApi, useStore } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
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
    ModuleId,
    UiModularFilter,
} from '../types/ModularFilterSpec'
import { SiteConfig } from '../types/SiteConfig'
import { convertToListDiff } from '../utils/ListDiffUtils'

export interface ImportedFilterSlice {
    importedModularFilters: Record<string, UiModularFilter>
    addImportedModularFilter: (filter: UiModularFilter) => void
    removeImportedModularFilter: (filterId: FilterId) => void
    setActiveFilterId: (filterId: FilterId) => void
}

export interface FilterConfigurationSlice {
    filterConfigurations: { [key: FilterId]: ModularFilterConfigurationV2 }
    setEnabledModule: (
        filterId: FilterId,
        moduleId: ModuleId,
        enabled: boolean
    ) => void
    setFilterConfiguration: <I extends Input>(
        filterId: FilterId,
        macroName: MacroName,
        data: InputConfig<I>
    ) => void
    clearConfiguration: (filterId: FilterId, macros: string[]) => void
    addFilterConfiguration: (
        filterId: FilterId,
        config: ModularFilterConfigurationV2
    ) => void
}

const createImportedFilterSlice: StateCreator<
    ImportedFilterSlice & FilterConfigurationSlice,
    [],
    [],
    ImportedFilterSlice
> = (set) => ({
    importedModularFilters: {},
    addImportedModularFilter: (filter: UiModularFilter) =>
        set((state) => ({
            importedModularFilters: {
                ...state.importedModularFilters,
                [filter.id]: filter,
            },
        })),
    removeImportedModularFilter: (filterId: FilterId) =>
        set((state) => ({
            importedModularFilters: Object.fromEntries(
                Object.entries(state.importedModularFilters).filter(
                    ([key]) => key !== filterId
                )
            ),
            filterConfigurations: Object.fromEntries(
                Object.entries(state.filterConfigurations).filter(
                    ([key]) => key !== filterId
                )
            ),
        })),
    setActiveFilterId: (filterId: FilterId) =>
        set((state) => ({
            importedModularFilters: {
                ...mapObject(state.importedModularFilters, (filter) => ({
                    ...filter,
                    active: filter.id === filterId,
                })),
            },
        })),
})

const createFilterConfigurationSlice: StateCreator<
    FilterConfigurationSlice,
    [],
    [],
    FilterConfigurationSlice
> = (set) => ({
    filterConfigurations: {},
    setFilterConfiguration: <I extends Input>(
        filterId: FilterId,
        macroName: MacroName,
        data: InputConfig<I>
    ) => {
        set((state) => {
            let newConfig = data
            if (Array.isArray(data)) {
                // For arrays, replace the entire value
                newConfig = data
            } else if (typeof data === 'object' && data !== null) {
                const currentData =
                    state.filterConfigurations?.[filterId]?.inputConfigs?.[
                        macroName
                    ] ?? {}
                // For objects, merge with existing config
                newConfig = { ...(currentData as object), ...data }
            } else {
                // For primitives (string, number, boolean), use the value directly
                newConfig = data
            }

            return {
                filterConfigurations: {
                    ...state.filterConfigurations,
                    [filterId]: {
                        ...(state.filterConfigurations[filterId] ?? {}),
                        inputConfigs: {
                            ...(state.filterConfigurations[filterId]
                                ?.inputConfigs ?? {}),
                            [macroName]: newConfig,
                        },
                    },
                },
            } as Partial<FilterConfigurationSlice>
        })
    },
    addFilterConfiguration: (
        filterId: FilterId,
        config: ModularFilterConfigurationV2
    ) => {
        set((state) => ({
            filterConfigurations: {
                ...state.filterConfigurations,
                [filterId]: config,
            },
        }))
    },
    setEnabledModule: (
        filterId: FilterId,
        moduleId: ModuleId,
        enabled: boolean
    ) => {
        set(
            (state) =>
                ({
                    filterConfigurations: {
                        ...state.filterConfigurations,
                        [filterId]: {
                            ...state.filterConfigurations[filterId],
                            enabledModules: {
                                ...(state.filterConfigurations[filterId]
                                    ?.enabledModules ?? {}),
                                [moduleId]: enabled,
                            },
                        },
                    },
                }) as Partial<FilterConfigurationSlice>
        )
    },
    clearConfiguration: (filterId: FilterId, macros: string[]) => {
        return set(
            (state) => ({
                ...state,
                filterConfigurations: {
                    ...state.filterConfigurations,
                    [filterId]: {
                        ...state.filterConfigurations[filterId],
                        inputConfigs: {
                            ...(state.filterConfigurations[filterId]
                                ?.inputConfigs ?? {}),
                            ...Object.fromEntries(
                                macros.map((macro) => {
                                    return [macro, {}]
                                })
                            ),
                        },
                    },
                },
            }),
            true
        )
    },
})

export interface DeleteFilterSlice {
    deleteFilter: (filterId: FilterId) => void
}

const createDeleteFilterSlice: StateCreator<
    ImportedFilterSlice & FilterConfigurationSlice & DeleteFilterSlice,
    [],
    [],
    DeleteFilterSlice
> = (set) => ({
    deleteFilter: (filterId: FilterId) =>
        set((state) => ({
            importedModularFilters: Object.fromEntries(
                Object.entries(state.importedModularFilters).filter(
                    ([key]) => key !== filterId
                )
            ),
            filterConfigurations: Object.fromEntries(
                Object.entries(state.filterConfigurations).filter(
                    ([key]) => key !== filterId
                )
            ),
        })),
})

export interface SiteConfigSlice {
    siteConfig: SiteConfig
    setSiteConfig: (config: Partial<SiteConfig>) => void
}

const isLocal =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'

const createSiteConfigSlice: StateCreator<
    SiteConfigSlice &
        ImportedFilterSlice &
        FilterConfigurationSlice &
        DeleteFilterSlice,
    [],
    [],
    SiteConfigSlice
> = (set) => ({
    siteConfig: {
        devMode: isLocal,
        isLocal: isLocal,
    },
    setSiteConfig: (config: Partial<SiteConfig>) =>
        set((state) => ({
            siteConfig: { ...state.siteConfig, ...config },
        })),
})

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

const migrate = (
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

const uiStore = create<
    SiteConfigSlice &
        ImportedFilterSlice &
        FilterConfigurationSlice &
        DeleteFilterSlice
>()(
    devtools(
        persist(
            (...a) => ({
                ...createSiteConfigSlice(...a),
                ...createImportedFilterSlice(...a),
                ...createFilterConfigurationSlice(...a),
                ...createDeleteFilterSlice(...a),
            }),
            {
                name: 'modular-filter-storage',
                version: 2,
                migrate,
            }
        )
    )
)

const createBoundedUseStore = ((store) => (selector) =>
    useStore(store, selector)) as <S extends StoreApi<unknown>>(
    store: S
) => {
    (): ExtractState<S>
    <T>(selector: (state: ExtractState<S>) => T): T
}

type ExtractState<S> = S extends { getState: () => infer X } ? X : never

export const useUiStore = createBoundedUseStore(uiStore)
