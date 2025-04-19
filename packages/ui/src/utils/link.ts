import {
    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent,
} from 'lz-string'
import { Filter, FilterConfiguration } from '../parsing/UiTypesSpec'

export const createLink = (
    filter: Filter | string,
    config: FilterConfiguration | undefined
) => {
    const data = {
        filterUrl: typeof filter === 'string' ? filter : filter.source,
        config: config,
    }

    const component = compressToEncodedURIComponent(JSON.stringify(data))

    if (component.length >= 15 * 1024) {
        return Promise.reject(new Error('Link is too long'))
    }

    return Promise.resolve(
        `${window.location.protocol}//${window.location.host}/import?importData=${component}`
    )
}

export const parseComponent = async (
    component: string
): Promise<{
    filterUrl: string
    config: FilterConfiguration
}> => {
    const data = decompressFromEncodedURIComponent(component)
    const parsedData = JSON.parse(data)
    return parsedData
}
