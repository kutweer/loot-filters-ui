import { parse } from '../parsing/parse'

const loadFilterFromUrl = async (url: string) => {
    const response = await fetch(url)
    const filterText = await response.text()

    const { errors, filter } = await parse(filterText)

    if (errors && errors.length > 0) {
        throw Error('Failed to parse filter: ' + JSON.stringify(errors))
    }

    return filter
}
