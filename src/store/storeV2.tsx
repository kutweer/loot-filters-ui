import { CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { isObject } from 'underscore'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Filter, FilterConfiguration } from '../parsing/UiTypesSpec'
import { SiteConfig } from '../types/SiteConfig'
import { loadFilterFromUrl } from '../utils/loaderv2'

const filterUrls: Record<string, string> = {
    'riktenx:filterscape':
        'https://raw.githubusercontent.com/riktenx/filterscape/refs/heads/main/filterscape.rs2f',
    'typical-whack:loot-filters-modules':
        'https://raw.githubusercontent.com/typical-whack/loot-filters-modules/refs/heads/main/filter.rs2f',
    'Blooprnt:ClearLoot':
        'https://raw.githubusercontent.com/Blooprnt/ClearLoot/refs/heads/main/clearloot.rs2f',
}

export const requiresMigration = () => {
    const migrated = localStorage.getItem('modular-filter-storage-migrated')
    if (migrated === 'true') {
        return false
    }

    const data = localStorage.getItem('modular-filter-storage')
    if (!data) {
        localStorage.setItem('modular-filter-storage-migrated', 'true')
        return false
    }

    return true
}

export const MigrateLegacyData: React.FC = () => {
    const { setFilterConfiguration } = useFilterConfigStore()
    const { updateFilter } = useFilterStore()

    const data = localStorage.getItem('modular-filter-storage')!!
    const legacyData = JSON.parse(data).state

    const [migrationsStarted, setMigrationsStarted] = useState<string[]>([])

    Object.values(legacyData.importedModularFilters).forEach(
        ({ id, name, active, source: { owner, repo } }: any, index: number) => {
            const url = filterUrls[`${owner}:${repo}`]
            if (!url || migrationsStarted.includes(url)) {
                return
            }
            setMigrationsStarted((prev) => [...prev, url])
            const configs = legacyData.filterConfigurations[id] ?? {}
            loadFilterFromUrl(url)
                .then((filter) => {
                    setMigrationsStarted((prev) =>
                        prev.filter((url) => url !== url)
                    )
                    updateFilter({ ...filter, id: id, name, active })
                    setFilterConfiguration(id, configs)
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    )

    const checkMigrations = () => {
        if (migrationsStarted.length === 0) {
            localStorage.setItem('modular-filter-storage-migrated', 'true')
            window.location.reload()
        } else {
            setTimeout(checkMigrations, 1000)
        }
    }

    setTimeout(checkMigrations, 1000)

    useEffect(() => {
        if (migrationsStarted.length === 0) {
            localStorage.setItem('modular-filter-storage-migrated', 'true')
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        }
    }, [migrationsStarted])

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <div>
                <Typography variant="h6" color="primary">
                    Legacy data detected, migrating...
                    <CircularProgress />
                </Typography>
                <Typography variant="h6" color="primary">
                    Page will reload when done.
                </Typography>
            </div>
        </div>
    )
}

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
