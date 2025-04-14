import { generateId } from '../utils/idgen'
import { FilterSpec, Module } from './UiTypesSpec'
import { parseInput } from './parseInput'
import { parseModule } from './parseModule'
import { parseMetaDescription, parseMetaName } from './rs2fParser'

const parseDeclaration = (line: string) => {
    const match = line.match(/define:([a-z]+):([a-z0-9_]+)/)
    if (!match) {
        throw new Error(`Unparseable declaration at '${line}'`)
    }
    return {
        type: match[1],
        id: match[2],
    }
}

const extractStructuredComments = (
    lines: string[]
): { start: number; end: number }[] => {
    const structuredComments: { start: number; end: number }[] = []

    let currentComment: { start: number; end: number } | null = null

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        if (line.startsWith('/*@')) {
            if (currentComment !== null) {
                throw new Error(
                    `Unexpected new declaration at ${i}: ${line} still parsing comment starting at ${currentComment.start}`
                )
            }

            currentComment = { start: i, end: i }
        }

        if (line.endsWith('*/') && currentComment !== null) {
            currentComment.end = i + 1
            structuredComments.push(currentComment)
            currentComment = null
        }
    }
    return structuredComments
}

export const parse = async (filter: string) => {
    // Remove escaped newlines before any other processing
    const lines = filter.replace(/\\\n\s*/g, '').split('\n')

    const modulesById: Record<string, Module> = {}
    const structuredComments = extractStructuredComments(lines)

    const errors = []

    for (const comment of structuredComments) {
        try {
            const line = lines[comment.start]
            const declaration = parseDeclaration(line.slice(3).trim())
            switch (declaration.type) {
                case 'module':
                    modulesById[declaration.id] = parseModule(
                        declaration.id,
                        lines,
                        comment.start,
                        comment.end
                    )
                    break
                case 'input':
                    const input = parseInput(
                        declaration.id,
                        lines,
                        comment.start,
                        comment.end
                    )
                    const module = modulesById[input.moduleId]
                    if (!module) {
                        throw new Error(
                            `Module ${input.moduleId} not found for input of macro ${input.input.macroName}`
                        )
                    }
                    module.inputs.push(input.input)
                    break
            }
        } catch (e) {
            errors.push({
                line: lines.slice(comment.start, comment.end).join('\n'),
                message: e,
            })
        }
    }

    if (errors.length > 0) {
        return {
            errors,
            filter: undefined,
        }
    }

    const filterBytes = new TextEncoder().encode(filter)
    const hashBuffer = await window.crypto.subtle.digest('SHA-1', filterBytes)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const rs2fHash = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

    const name = parseMetaName(filter)
    const description = parseMetaDescription(filter)

    const parsedFilter = FilterSpec.parse({
        id: generateId(),
        name,
        description,
        modules: Object.values(modulesById),
        importedOn: new Date().toISOString(),
        source: undefined,
        active: false,
        rs2f: filter,
        rs2fHash,
    })

    return {
        errors: undefined,
        filter: parsedFilter,
    }
}
