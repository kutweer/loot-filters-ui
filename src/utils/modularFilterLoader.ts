import { buildFilterUrl, currentGhMeta } from '../types/GitHubFilterSource'
import {
    FilterDefinition,
    FilterModule,
    FilterSource,
    InlineModule,
    ModuleSource,
    OldModuleSource,
    RelativeModuleSource,
    UiFilterModule,
    UiModularFilter,
} from '../types/ModularFilterSpec'
import { assertString, validateModule } from '../types/validate'

export const trimUrl = (input: string): string => {
    const lastSlashIndex = input.lastIndexOf('/')
    if (lastSlashIndex === -1) {
        return input // No slash found, return the whole string
    }
    return input.substring(0, lastSlashIndex)
}

const moduleType = (source: ModuleSource): 'old' | 'relative' | 'inline' => {
    if (
        'moduleJson' in source &&
        source.moduleJson &&
        'moduleRs2fText' in source &&
        typeof source.moduleRs2fText === 'string'
    ) {
        return 'inline'
    }

    if (
        'moduleJsonUrl' in source &&
        source.moduleJsonUrl &&
        'moduleRs2fUrl' in source &&
        source.moduleRs2fUrl
    ) {
        return 'old'
    }

    if ('modulePath' in source && source.modulePath) {
        return 'relative'
    }

    throw new Error(
        `Invalid module source '${JSON.stringify(source)}', no moduleJson or moduleJsonUrl, no modulePath`
    )
}

const loadOldModule = async (
    oldSource: OldModuleSource
): Promise<UiFilterModule> => {
    const moduleJsonResponse = await fetch(oldSource.moduleJsonUrl)
    const moduleJson = (await moduleJsonResponse.json()) as FilterModule

    const moduleRs2fResponse = await fetch(oldSource.moduleRs2fUrl)
    const moduleRs2fText = await moduleRs2fResponse.text()

    const oldMoudle = {
        ...moduleJson,
        rs2fText: moduleRs2fText,
        source: oldSource,
        id: crypto.randomUUID(),
    }

    validateModule(oldMoudle)
    return oldMoudle
}

const loadInlineModule = async (
    inlineSource: InlineModule
): Promise<UiFilterModule> => {
    console.log(inlineSource.moduleRs2fText)
    const inlineModule = {
        ...inlineSource.moduleJson,
        rs2fText: inlineSource.moduleRs2fText,
        source: inlineSource,
        id: crypto.randomUUID(),
    }

    validateModule(inlineModule)
    return inlineModule
}

const loadRelativeModule = async (
    moduleSource: RelativeModuleSource,
    filterSource: FilterSource | UiModularFilter
): Promise<UiFilterModule> => {
    let baseUrl = ''
    if ('filterUrl' in filterSource && filterSource.filterUrl) {
        baseUrl = trimUrl(filterSource.filterUrl)
    } else if ('repo' in filterSource && filterSource.repo) {
        baseUrl = trimUrl(await buildFilterUrl(filterSource))
    } else if ('source' in filterSource && filterSource.source) {
        return loadRelativeModule(
            moduleSource,
            filterSource.source as FilterSource
        )
    } else {
        throw new Error(
            'Filter source is required for relative module resolution'
        )
    }

    let moduleJsonUrl = moduleSource.modulePath
    if (!moduleJsonUrl.startsWith('https://')) {
        moduleJsonUrl = `${baseUrl}/${moduleJsonUrl}`
    }

    const moduleJsonResponse = await fetch(moduleJsonUrl)
    const moduleJson = (await moduleJsonResponse.json()) as FilterModule

    if (!moduleJson.rs2fPath) {
        throw new Error(`Module ${moduleJson.name} has no rs2fPath`)
    }
    let moduleRs2fUrl = moduleJson.rs2fPath
    if (!moduleJson.rs2fPath.startsWith('https://')) {
        const moduleBaseUrl = trimUrl(moduleJsonUrl)
        moduleRs2fUrl = `${moduleBaseUrl}/${moduleJson.rs2fPath}`
    }
    const moduleRs2fResponse = await fetch(moduleRs2fUrl)
    const moduleRs2fText = await moduleRs2fResponse.text()

    const module = {
        ...moduleJson,
        rs2fText: moduleRs2fText,
        source: moduleSource,
        id: crypto.randomUUID(),
    } as UiFilterModule

    validateModule(module)
    return module
}

export const loadFilter = async (
    filterSourceInput: FilterSource | UiModularFilter
): Promise<UiModularFilter> => {
    console.log('loading filter', filterSourceInput)

    const filterSource = { ...filterSourceInput }

    let filter: FilterDefinition
    if ('filterUrl' in filterSource && filterSource.filterUrl) {
        const response = await fetch(filterSource.filterUrl)
        filter = (await response.json()) as FilterDefinition
    } else if ('repo' in filterSource && filterSource.repo) {
        const {
            sha,
            commit: {
                author: { date },
            },
        } = await currentGhMeta(filterSource)
        filterSource.updateMeta = {
            sha,
            updatedAt: date,
        }
        const filterUrl = await buildFilterUrl(filterSource)
        console.log('filterUrl', filterUrl)
        const response = await fetch(filterUrl)
        console.log('response', response)
        filter = (await response.json()) as FilterDefinition
        console.log('Loaded github filter:', filter)
    } else {
        // even if the source is a ModularFilter, some modules may not be loaded
        filter = filterSource as FilterDefinition
    }

    assertString(filter, 'name')
    assertString(filter, 'description')

    const resolvedModules: UiFilterModule[] = await Promise.all(
        filter.modules.map(
            async (moduleSource: ModuleSource): Promise<UiFilterModule> => {
                switch (moduleType(moduleSource)) {
                    case 'relative':
                        return loadRelativeModule(
                            moduleSource as RelativeModuleSource,
                            filterSource
                        )
                    case 'old':
                        return loadOldModule(moduleSource as OldModuleSource)
                    case 'inline':
                        return loadInlineModule(moduleSource as InlineModule)
                    default:
                        throw new Error(
                            `Invalid module source '${JSON.stringify(moduleSource)}', no moduleJson or moduleJsonUrl, no modulePath`
                        )
                }
            }
        )
    )

    const finalFilter: UiModularFilter = {
        name: filter.name,
        // id implies it was an actual filter instance not a source
        source: 'id' in filterSource ? undefined : filterSource,
        id: crypto.randomUUID(),
        description: filter.description,
        modules: resolvedModules,
        importedOn: new Date().toISOString(),
        active: false,
    }
    return finalFilter
}
