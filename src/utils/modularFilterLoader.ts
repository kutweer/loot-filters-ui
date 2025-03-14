import {
    FilterDefinition,
    FilterModule,
    FilterSource,
    ModuleSource,
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

export const loadFilter = async (
    source: FilterSource | UiModularFilter
): Promise<UiModularFilter> => {
    let filter: FilterDefinition

    if ('filterUrl' in source && source.filterUrl) {
        const response = await fetch(source.filterUrl)
        filter = (await response.json()) as FilterDefinition
    } else {
        // even if the source is a ModularFilter, some modules may not be loaded
        filter = source as FilterDefinition
    }

    assertString(filter, 'name')
    assertString(filter, 'description')

    const resolvedModules: UiFilterModule[] = await Promise.all(
        filter.modules.map(
            async (
                moduleSource: ModuleSource | FilterModule
            ): Promise<UiFilterModule> => {
                if (
                    'moduleJson' in moduleSource &&
                    moduleSource.moduleJson &&
                    'moduleRs2fText' in moduleSource &&
                    typeof moduleSource.moduleRs2fText === 'string'
                ) {
                    const module = {
                        ...moduleSource.moduleJson,
                        rs2fText: moduleSource.moduleRs2fText,
                        source: moduleSource,
                        id: crypto.randomUUID(),
                    }

                    validateModule(module)
                    return module
                } else if (
                    'moduleJsonUrl' in moduleSource &&
                    moduleSource.moduleJsonUrl &&
                    'moduleRs2fUrl' in moduleSource &&
                    moduleSource.moduleRs2fUrl
                ) {
                    const moduleJsonResponse = await fetch(
                        moduleSource.moduleJsonUrl
                    )
                    const moduleJson =
                        (await moduleJsonResponse.json()) as FilterModule

                    const moduleRs2fResponse = await fetch(
                        moduleSource.moduleRs2fUrl
                    )
                    const moduleRs2fText = await moduleRs2fResponse.text()

                    const module = {
                        ...moduleJson,
                        rs2fText: moduleRs2fText,
                        source: moduleSource,
                        id: crypto.randomUUID(),
                    }

                    validateModule(module)
                    return module
                } else if (
                    'modulePath' in moduleSource &&
                    moduleSource.modulePath &&
                    'filterUrl' in source &&
                    source.filterUrl
                ) {
                    const baseUrl = trimUrl(source.filterUrl)
                    let moduleJsonUrl = moduleSource.modulePath
                    if (!moduleSource.modulePath.startsWith('https://')) {
                        moduleJsonUrl = `${baseUrl}/${moduleSource.modulePath}`
                    }

                    const moduleJsonResponse = await fetch(moduleJsonUrl)
                    const moduleJson =
                        (await moduleJsonResponse.json()) as FilterModule

                    if (!moduleJson.rs2fPath) {
                        throw new Error(
                            `Module ${moduleJson.name} has no rs2fPath`
                        )
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
                } else {
                    throw new Error(
                        `Invalid module source '${JSON.stringify(moduleSource)}', no moduleJson or moduleJsonUrl, no modulePath`
                    )
                }
            }
        )
    )

    return {
        name: filter.name,
        source: 'filterUrl' in source && source.filterUrl ? source : undefined,
        id: crypto.randomUUID(),
        description: filter.description,
        modules: resolvedModules,
        importedOn: new Date().toISOString(),
        active: false,
    }
}
