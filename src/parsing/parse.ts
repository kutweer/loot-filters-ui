import { parse as parseYaml } from 'yaml'
import { Input, InputType, inputTypes } from '../types/InputsSpec'
import { parseDefine, Rs2fDefine } from './rs2fParser'

type Declaration = {
    type: 'input' | 'module'
    declarationContent: string
    id: string
}

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
export const parse = (filter: string) => {
    const declarationBlocks: (
        | (Declaration & { module: any })
        | (Declaration & { input: any; defaultRs2f: string })
    )[] = []

    const lines = filter.split('\n')

    // the define:[module|input]:id bit; as an object
    let declaration: { type: string; id: string } | null = null
    let declarationContent: string | null = null

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        const line = lines[lineNumber]
        if (line.startsWith('/*@')) {
            if (declaration === null && declarationContent === null) {
                declaration = parseDeclaration(line.slice(3).trim())
                continue
            } else {
                throw new Error(
                    `Unexpected new declaration at ${lineNumber}: ${line} still parsing ${declaration}`
                )
            }
        }

        if (line.endsWith('*/') && declaration !== null) {
            if (declaration.type === 'input' && declarationContent !== null) {
                const input = parseYaml(declarationContent)
                const inputDefault: Rs2fDefine = parseDefine(
                    lines[lineNumber + 1]
                )

                validateInput(input, inputDefault)

                input['default'] = inputDefault

                declarationBlocks.push({
                    type: declaration.type,
                    id: declaration.id,
                    input: input,
                    // TODO can probably remove this once the parsing fully works
                    declarationContent: declarationContent,
                    defaultRs2f: lines[lineNumber + 1],
                })
            } else if (
                declaration.type === 'module' &&
                declarationContent !== null
            ) {
                const module = parseYaml(declarationContent!!)
                declarationBlocks.push({
                    type: declaration.type,
                    id: declaration.id,
                    declarationContent: declarationContent,
                    module: module,
                })
            } else {
                throw new Error(
                    `Unparseable declaration of type ${declaration.type}`
                )
            }

            declaration = null
            declarationContent = null
        }

        if (declaration !== null) {
            if (declarationContent === null) {
                declarationContent = line + '\n'
            } else {
                declarationContent += line + '\n'
            }
        }
    }
    return declarationBlocks
}

const checkType = (
    input: Input,
    type: Rs2fDefine['type'],
    expected: Rs2fDefine['type']
) => {
    if (type === 'null') {
        return
    }
    if (type !== expected) {
        throw new Error(
            `Input ${input.type} requires a default of type ${expected} got ${type}`
        )
    }
}

function validateInput(input: any, inputDefault: Rs2fDefine) {
    if (!('type' in input)) {
        throw new Error('Input must have a type')
    }

    if (!(input.type in inputTypes)) {
        throw new Error(`Invalid input type: ${input.type}`)
    }

    console.log('input', input)
    console.log('inputDefault', inputDefault)

    switch (input.type as InputType) {
        case 'style':
            checkType(input, inputDefault.type, 'style')
            break
        case 'stringlist':
            checkType(input, inputDefault.type, 'stringlist')
            break
        case 'boolean':
            checkType(input, inputDefault.type, 'boolean')
            break
        case 'number':
            checkType(input, inputDefault.type, 'number')
            break
        case 'enumlist':
            checkType(input, inputDefault.type, 'stringlist')
            if (
                !input.enum ||
                !Array.isArray(input.enum) ||
                input.enum.length === 0
            ) {
                throw new Error(
                    'Enumlist input must have an enum with 1 or more values'
                )
            }
            break
        case 'text':
            checkType(input, inputDefault.type, 'string')
            break
        case 'includeExcludeList':
            throw new Error('IncludeExcludeList is not supported')
        default:
            throw new Error(`Invalid input type: ${input.type}`)
    }
}
