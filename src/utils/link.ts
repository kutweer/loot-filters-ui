import {
    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent,
} from 'lz-string'
import { Filter, FilterConfiguration } from '../parsing/UiTypesSpec'

export const createLink = (
    filter: Filter,
    config: FilterConfiguration | undefined
) => {
    const data = {
        filterUrl: filter.source,
        config: config,
    }

    console.log('data', JSON.stringify(data))
    const component = compressToEncodedURIComponent(JSON.stringify(data))

    if (component.length >= 100 * 1024) {
        return Promise.reject(new Error('Link is too long'))
    }

    return Promise.resolve(
        `${window.location.protocol}//${window.location.host}/import?importData=${component}`
    )
}

export const parseComponent = (
    component: string
): {
    filterUrl: string
    config: FilterConfiguration
} => {
    const data = decompressFromEncodedURIComponent(component)
    console.log('data', data)
    const parsedData = JSON.parse(data)
    return parsedData
}
