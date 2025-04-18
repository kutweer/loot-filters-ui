import { parseAsync as parse } from '../parsing/parse'
import { Filter } from '../parsing/UiTypesSpec'

export const loadFilterFromUrl = async (url: string): Promise<Filter> => {
    const response = await fetch(url)
    const filterText = await response.text()

    const { errors, filter } = await parse(filterText, true)

    if (errors && errors.length > 0) {
        throw Error('Failed to parse filter: ' + JSON.stringify(errors))
    }

    if (filter == null) {
        throw Error('This should be impossible')
    }

    filter.source = url
    return filter
}
