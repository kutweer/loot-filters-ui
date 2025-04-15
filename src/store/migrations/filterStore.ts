import { FilterStoreState } from '../filterStore'
import { legacyFilterUrls } from './MigrateLegacyData'

export const migrateFilterStore = (
    state: FilterStoreState,
    version: number
) => {
    let updated = { ...state }
    if (version < 2) {
        toV2(state)
    }

    return updated
}

/**
 * Corrects the missing source url in filters in the store, copies the source url from the legacy data
 */

const toV2 = (state: FilterStoreState) => {
    const data = JSON.parse(
        localStorage.getItem('modular-filter-storage') ?? '{}'
    )
    const filters = Object.values(data.state.importedModularFilters)

    filters.forEach(({ id, source: { owner, repo } }: any) => {
        const url = legacyFilterUrls[`${owner}:${repo}`]
        if (!url) {
            return
        }

        state.filters[id] = {
            ...state.filters[id],
            source: url,
        }
    })
}
