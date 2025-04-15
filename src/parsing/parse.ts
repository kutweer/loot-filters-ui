import { generateId } from '../utils/idgen'
import { Filter, FilterSpec, Module } from './UiTypesSpec'
import { parseInput } from './parseInput'
import { parseModule } from './parseModule'
import { parseMetaDescription, parseMetaName } from './rs2fParser'
import { Lexer } from './lexer'
import { Token, TokenType } from './token'
import { TokenStream } from './tokenstream'

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

export type ParseResult = {
    errors?: Array<{ line: string; error: Error }>
    filter?: Filter
}

export const parse = async (filter: string): Promise<ParseResult> => {
    const tokens = new TokenStream(new Lexer(filter).tokenize())

    const modulesById: Record<string, Module> = {}
    const errors: { line: string; error: Error }[] = []

    while (tokens.hasTokens()) {
        const next = tokens.take()!!
        if (!isStructuredComment(next)) {
            continue
        }

        try {
            const declaration = parseDeclaration(next.value.slice(3).trim())
            switch (declaration.type) {
                case 'module':
                    modulesById[declaration.id] = parseModule(
                        declaration.id,
                        next.value
                    )
                    break
                case 'input':
                    const define = new TokenStream([
                        // define MUST come after the input declaration
                        tokens.takeExpect(TokenType.PREPROC_DEFINE),
                        ...tokens.takeLine().getTokens(),
                    ])
                    const input = parseInput(declaration.id, next.value, define)
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
                line: next.value,
                error: e as Error,
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
    const description = parseMetaDescription(filter) || undefined

    try {
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
    } catch (e) {
        return {
            errors: [
                {
                    line: filter,
                    error: e as Error,
                },
            ],
            filter: undefined,
        }
    }
}

const isStructuredComment = (token: Token) =>
    token.type === TokenType.COMMENT && token.value.startsWith('/*@')
