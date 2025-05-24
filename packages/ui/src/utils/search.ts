import Fuse from 'fuse.js'
import { groupBy } from 'underscore'

import { Module, Input } from '../parsing/UiTypesSpec'

const MIN_SEARCH_LENGTH = 3

// fuzzy score threshold - 0 means perfect match, 1 means not at all
// this number is selected through trial and error
const FUZZY_THRESHOLD = 0.3

export type SearchState = 'none' | 'expand' | 'hide'

export type ModuleSearchResult = {
    state: SearchState
    groups: Record<string, GroupSearchResult>
}

export type GroupSearchResult = {
    state: SearchState
    inputs: Record<string, InputSearchResult>
}

export type InputSearchResult = {
    state: SearchState
}

export const searchModule = (
    input: Module,
    search: string
): ModuleSearchResult => {
    const result = init(input)
    if (search.length < MIN_SEARCH_LENGTH) {
        return result
    }

    result.state = 'hide'
    if (isStringMatch(input.name, search)) {
        result.state = 'expand'
        return result
    }

    for (const [groupName, group] of Object.entries(result.groups)) {
        group.state = 'hide'
        if (isStringMatch(groupName, search)) {
            result.state = 'expand'
            group.state = 'expand'
            continue
        }

        for (const inputName of Object.keys(group.inputs)) {
            // for now we don't hide unmatched inputs within a module
            // input.state = 'hide'
            if (isStringMatch(inputName, search)) {
                result.state = 'expand'
                group.state = 'expand'
                // input.state = 'expand'
            }
        }
    }

    return result
}

const init = (input: Module): ModuleSearchResult => {
    const result: ModuleSearchResult = {
        state: 'none',
        groups: {},
    }

    const groupedInputs = groupBy(
        input.inputs.map((input) => ({
            ...input,
            group: input.group ?? '_',
        })),
        'group'
    )

    for (const [name, inputs] of Object.entries(groupedInputs)) {
        result.groups[name] = {
            state: 'none',
            inputs: inputs.reduce(
                (acc, v) => ({ ...acc, [v.label]: { state: 'none' } }),
                {}
            ),
        }
    }

    return result
}

const isStringMatch = (input: string, search: string): boolean => {
    const fuse = new Fuse([input], {
        includeScore: true,
    })
    const result = fuse.search(search)
    return result.length > 0 && (result[0].score ?? 1) < FUZZY_THRESHOLD
}
