import { mapObject } from 'underscore'
import { create, StateCreator, StoreApi, useStore } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Input, InputDefault, MacroName } from '../types/InputsSpec'
import {
    FilterId,
    ModularFilterConfiguration,
    ModuleId,
    UiModularFilter,
} from '../types/ModularFilterSpec'
import { SiteConfig } from '../types/SiteConfig'

export interface ImportedFilterSlice {
    importedModularFilters: Record<string, UiModularFilter>
    addImportedModularFilter: (filter: UiModularFilter) => void
    removeImportedModularFilter: (filterId: FilterId) => void
    setActiveFilterId: (filterId: FilterId) => void
}

export interface FilterConfigurationSlice {
    filterConfigurations: { [key: FilterId]: ModularFilterConfiguration }
    setFilterConfiguration: (
        filterId: FilterId,
        moduleId: ModuleId,
        macroName: string,
        data: Partial<InputDefault<Input>>
    ) => void
    addFilterConfiguration: (
        filterId: FilterId,
        config: ModularFilterConfiguration
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
    setFilterConfiguration: (
        filterId: FilterId,
        moduleId: ModuleId,
        macroName: string,
        data: Partial<InputDefault<Input>>
    ) => {
        set((state) => {
            const allConfigs: { [key: FilterId]: ModularFilterConfiguration } =
                state.filterConfigurations
            const thisFiltersConfig: {
                [key: ModuleId]: {
                    [key: MacroName]: Partial<InputDefault<Input>>
                }
            } = allConfigs[filterId] ?? {}
            const thisModulesConfig: {
                [key: MacroName]: Partial<InputDefault<Input>>
            } = thisFiltersConfig[moduleId] ?? {}
            const thisMacrosConfig: Partial<InputDefault<Input>> =
                thisModulesConfig[macroName] ?? {}

            let newConfig: Partial<InputDefault<Input>>
            if (Array.isArray(data)) {
                // For arrays, replace the entire value
                newConfig = data
            } else if (typeof data === 'object' && data !== null) {
                // For objects, merge with existing config
                newConfig = { ...(thisMacrosConfig as object), ...data }
            } else {
                // For primitives (string, number, boolean), use the value directly
                newConfig = data
            }

            return {
                ...state,
                filterConfigurations: {
                    ...allConfigs,
                    [filterId]: {
                        ...thisFiltersConfig,
                        [moduleId]: {
                            ...thisModulesConfig,
                            [macroName]: newConfig,
                        },
                    },
                },
            }
        })
    },
    addFilterConfiguration: (
        filterId: FilterId,
        config: ModularFilterConfiguration
    ) => {
        set((state) => ({
            ...state,
            filterConfigurations: {
                ...state.filterConfigurations,
                [filterId]: config,
            },
        }))
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
