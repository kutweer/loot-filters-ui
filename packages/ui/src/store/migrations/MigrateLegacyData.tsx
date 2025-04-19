import { CircularProgress } from '@mui/material'

import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { loadFilterFromUrl } from '../../utils/loaderv2'
import { useFilterConfigStore } from '../filterConfigurationStore'
import { useFilterStore } from '../filterStore'

export const legacyFilterUrls: Record<string, string> = {
    'riktenx:filterscape':
        'https://raw.githubusercontent.com/riktenx/filterscape/refs/heads/main/filter.rs2f',
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
            const url = legacyFilterUrls[`${owner}:${repo}`]
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
