import { isObject } from 'underscore'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { FilterConfiguration } from '../parsing/UiTypesSpec'

export interface FilterConfigurationStoreState {
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
