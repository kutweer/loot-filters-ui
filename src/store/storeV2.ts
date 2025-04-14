import { isObject } from 'underscore'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Filter, FilterConfiguration } from '../parsing/UiTypesSpec'
import { SiteConfig } from '../types/SiteConfig'

interface SiteConfigStoreState {
    siteConfig: SiteConfig
    setSiteConfig: (siteConfig: Partial<SiteConfig>) => void
}

export const useSiteConfigStore = create<SiteConfigStoreState>()(
    devtools(
        persist(
            (set) => ({
                siteConfig: {
                    devMode: false,
                    isLocal:
                        window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1',
                },
                setSiteConfig: (siteConfig: Partial<SiteConfig>) =>
                    set((state) => ({
                        siteConfig: {
                            ...state.siteConfig,
                            ...siteConfig,
                        },
                    })),
            }),
            {
                name: 'site-config-store',
                version: 1,
            }
        )
    )
)

interface FilterConfigurationStoreState {
    filterConfigurations: Record<string, FilterConfiguration>
    updateInputConfiguration: (
        filterId: string,
        macroName: string,
        value: any
    ) => void
    setFilterConfiguration: (
        filterId: string,
        filterConfiguration: FilterConfiguration
    ) => void
    removeFilterConfiguration: (filterId: string) => void
    clearConfiguration: (filterId: string, macroNames: string[]) => void
    setEnabledModule: (
        filterId: string,
        moduleId: string,
        enabled: boolean
    ) => void
}

export const useFilterConfigStore = create<FilterConfigurationStoreState>()(
    devtools(
        persist(
            (set) => ({
                filterConfigurations: {},
                setFilterConfiguration: (
                    filterId: string,
                    filterConfiguration: FilterConfiguration
                ) =>
                    set((state) => ({
                        filterConfigurations: {
                            ...state.filterConfigurations,
                            [filterId]: filterConfiguration,
                        },
                    })),
                setEnabledModule: (
                    filterId: string,
                    moduleId: string,
                    enabled: boolean
                ) =>
                    set((state) => {
                        return {
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
                        }
                    }),
                clearConfiguration: (filterId: string, macroNames: string[]) =>
                    set((state) => {
                        return {
                            filterConfigurations: {
                                ...state.filterConfigurations,
                                [filterId]: {
                                    ...state.filterConfigurations[filterId],
                                    inputConfigs: Object.fromEntries(
                                        Object.entries(
                                            state.filterConfigurations[filterId]
                                                ?.inputConfigs ?? {}
                                        ).filter(
                                            ([key]) => !macroNames.includes(key)
                                        )
                                    ),
                                },
                            },
                        }
                    }),
                updateInputConfiguration: (filterId, macroName, value) =>
                    set((state) => {
                        const existingConf =
                            state.filterConfigurations[filterId]
                                ?.inputConfigs?.[macroName]

                        const newConf = isObject(value)
                            ? {
                                  ...(existingConf ?? {}),
                                  ...value,
                              }
                            : value

                        return {
                            filterConfigurations: {
                                ...state.filterConfigurations,
                                [filterId]: {
                                    ...state.filterConfigurations[filterId],
                                    inputConfigs: {
                                        ...(state.filterConfigurations[filterId]
                                            ?.inputConfigs ?? {}),
                                        [macroName]: newConf,
                                    },
                                },
                            },
                        }
                    }),
                removeFilterConfiguration: (filterId: string) =>
                    set((state) => ({
                        filterConfigurations: Object.fromEntries(
                            Object.entries(state.filterConfigurations).filter(
                                ([key]) => key !== filterId
                            )
                        ),
                    })),
            }),
            {
                name: 'filter-configuration-store',
                version: 1,
            }
        )
    )
)

interface FilterStoreState {
    filters: Record<string, Filter>
    updateFilter: (filter: Filter) => void
    removeFilter: (filterId: string) => void
    setActiveFilter: (filterId: string) => void
}
export const useFilterStore = create<FilterStoreState>()(
    devtools(
        persist(
            (set) => {
                return {
                    filters: {},
                    updateFilter: (filter) =>
                        set((state) => ({
                            filters: {
                                ...state.filters,
                                [filter.id]: filter,
                            },
                        })),
                    removeFilter: (filterId: string) =>
                        set((state) => ({
                            filters: Object.fromEntries(
                                Object.entries(state.filters).filter(
                                    ([key]) => key !== filterId
                                )
                            ),
                        })),
                    setActiveFilter: (filterId: string) =>
                        set((state) => ({
                            filters: Object.fromEntries(
                                Object.entries(state.filters).map(
                                    ([key, filter]) => [
                                        key,
                                        {
                                            ...filter,
                                            active: key === filterId,
                                        },
                                    ]
                                )
                            ),
                        })),
                }
            },
            {
                name: 'filter-store',
                version: 1,
            }
        )
    )
)
