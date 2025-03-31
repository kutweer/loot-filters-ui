import { mapObject } from 'underscore'
import { create, StateCreator, StoreApi, useStore } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Input, InputConfig, MacroName } from '../types/InputsSpec'
import {
    FilterId,
    ModularFilterConfigurationV2,
    ModuleId,
    UiModularFilter,
} from '../types/ModularFilterSpec'
import { SiteConfig } from '../types/SiteConfig'
import { migrate } from './uiStoreMigrations'

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
    addImportedModularFilter: (filter: UiModularFilter) => {
        console.log('adding imported modular filter', filter)
        set((state) => ({
            importedModularFilters: {
                ...state.importedModularFilters,
                [filter.id]: filter,
            },
        }))
    },
    removeImportedModularFilter: (filterId: FilterId) => {
        console.log('removing imported modular filter', filterId)
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
        }))
    },
    setActiveFilterId: (filterId: FilterId) => {
        console.log('setting active filter id', filterId)
        set((state) => ({
            importedModularFilters: {
                ...mapObject(state.importedModularFilters, (filter) => ({
                    ...filter,
                    active: filter.id === filterId,
                })),
            },
        }))
    },
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
        console.log('setting filter configuration', filterId, macroName, data)
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
        console.log('adding filter configuration', filterId, config)
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
        console.log('setting enabled module', filterId, moduleId, enabled)
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
        console.log('clearing configuration', filterId, macros)
        return set((state) => {
            const filtersNewConfig = {
                ...state.filterConfigurations[filterId],
                inputConfigs: {
                    ...(state.filterConfigurations[filterId]?.inputConfigs ??
                        {}),
                },
            }

            macros.forEach((macro) => {
                delete filtersNewConfig.inputConfigs[macro]
            })

            return {
                ...state,
                filterConfigurations: {
                    ...state.filterConfigurations,
                    [filterId]: filtersNewConfig,
                },
            }
        }, true)
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
    deleteFilter: (filterId: FilterId) => {
        console.log('deleting filter', filterId)
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
        }))
    },
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
                version: 3,
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
