import { InputType, ModuleType } from './UiTypesSpec'
import { parseInput } from './parseInput'
import { parseModule } from './parseModule'

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

export const parse = (filter: string) => {
    // Remove escaped newlines before any other processing
    const lines = filter.replace(/\\\n\s*/g, '').split('\n')

    const modulesById: Record<string, ModuleType> = {}
    const inputs: { moduleId: string; input: InputType }[] = []
    const structuredComments = extractStructuredComments(lines)

    const errors = []

    for (const comment of structuredComments) {
        try {
            const line = lines[comment.start]
            const declaration = parseDeclaration(line.slice(3).trim())
            console.log('declaration', declaration)
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
                            `Module ${input.moduleId} not found for input on line ${comment.start}`
                        )
                    }
                    module.inputs.push(input.input)
                    break
            }
        } catch (e) {
            errors.push({
                comment: comment,
                message: e,
            })
        }
    }

    return modulesById
}
