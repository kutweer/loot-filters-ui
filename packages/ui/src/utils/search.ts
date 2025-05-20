import Fuse from 'fuse.js'
import { groupBy } from 'underscore'

import { Module, Input } from '../parsing/UiTypesSpec'

// fuzzy score threshold - 0 means perfect match, 1 means not at all
// this number is selected through trial and error
const FUZZY_THRESHOLD = 0.3

export type ModuleSearchResult = {
    nameMatches: boolean
    groups: Record<string, GroupSearchResult>
}

export type GroupSearchResult = {
    nameMatches: boolean
    matchedInputs: Record<string, boolean>
}

export const searchModule = (
    input: Module,
    search: string
): ModuleSearchResult => {
    const groupedInputs = groupBy(
        input.inputs.map((input) => ({
            ...input,
            group: input.group ?? '_',
        })),
        'group'
    )

    const groups: Record<string, GroupSearchResult> = {}
    for (const [name, inputs] of Object.entries(groupedInputs)) {
        const matchedInputs: Record<string, boolean> = {}
        for (const input of inputs) {
            matchedInputs[input.label] = isInputMatch(input, search)
        }

        groups[name] = {
            nameMatches: name !== '_' && isStringMatch(name, search),
            matchedInputs,
        }
    }

    return {
        nameMatches: isStringMatch(input.name, search),
        groups,
    }
}

const isStringMatch = (input: string, search: string): boolean => {
    const fuse = new Fuse([input], {
        includeScore: true,
    })
    const result = fuse.search(search)
    return result.length > 0 && (result[0].score ?? 1) < FUZZY_THRESHOLD
}

// FUTURE: right now this just checks label, in theory we'd also want to check
// things like the configured list or enum list
const isInputMatch = (input: Input, search: string): boolean => {
    const fuse = new Fuse([input.label], {
        includeScore: true,
    })
    const result = fuse.search(search)
    return result.length > 0 && (result[0].score ?? 1) < FUZZY_THRESHOLD
}
