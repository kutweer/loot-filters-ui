import {
    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent,
} from 'lz-string'
import {
    ModularFilterConfigurationV2,
    UiModularFilter,
} from '../types/ModularFilterSpec'

export const createLink = (
    filter: UiModularFilter,
    config: ModularFilterConfigurationV2 | undefined
) => {
    const data = {
        filter: filter,
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
    filter: UiModularFilter
    config: ModularFilterConfigurationV2
} => {
    const data = decompressFromEncodedURIComponent(component)
    console.log('data', data)
    const parsedData = JSON.parse(data)
    return parsedData
}
