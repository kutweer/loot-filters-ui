import { generateId } from '../utils/idgen'
import { Filter, FilterSpec, Module } from './UiTypesSpec'
import { Lexer } from './lexer'
import { parseInput } from './parseInput'
import { parseModule } from './parseModule'
import { parseMetaDescription, parseMetaName } from './rs2fParser'
import { Token, TokenType } from './token'
import { TokenStream } from './tokenstream'

const isModuleDeclaration = (token: Token) =>
    token.type === TokenType.COMMENT &&
    token.value.startsWith('/*@ define:module')

const isInputDeclaration = (token: Token) =>
    token.type === TokenType.COMMENT &&
    token.value.startsWith('/*@ define:input')

const parseModuleDeclaration = (line: string) => {
    const match = line.match(/\/\*@ define:([a-z]+):([a-z0-9_]+)/)
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

export const parseModules = (
    filter: string
): { errors?: Array<{ line: string; error: Error }>; modules?: Module[] } => {
    const result = parse(filter, false, { name: 'onlyModules' })
    return {
        errors: result.errors,
        modules: result.filter?.modules,
    }
}

export const parse = (
    filter: string,
    addHeaderModule: boolean = false,
    metaContentOverride?: { name: string; description?: string }
): ParseResult => {
    let tokens: TokenStream
    try {
        tokens = new TokenStream(new Lexer(filter).tokenize())
    } catch (e) {
        return {
            errors: [{ line: '', error: e as Error }],
        }
    }
    if (!tokens.hasTokens()) {
        return {
            errors: [{ line: '', error: new Error('filter is blank') }],
        }
    }

    const first = tokens.peek()!!
    if (!isModuleDeclaration(first)) {
        // If the filter doesn't start with a module declaration, we need to add a header module
        // but ONLY if we're doing the migration from v2 to v3...
        if (addHeaderModule) {
            return parse(
                `/*@ define:module:__migration_header__\nname: __migration_header__\nhidden: true\n*/\n` +
                    filter,
                false
            )
        }

        return {
            errors: [
                {
                    line: first.value,
                    error: new Error(
                        'filter MUST start with a module declaration'
                    ),
                },
            ],
        }
    }

    const modulesById: Record<string, Module> = {}
    const errors: { line: string; error: Error }[] = []

    // we vetted the first token above, the loop will properly init this
    let currentModule: string = ''

    while (tokens.hasTokens()) {
        const next = tokens.take(true)!! // preserve whitespace in output
        try {
            if (isModuleDeclaration(next)) {
                const decl = parseModuleDeclaration(next.value)
                currentModule = decl.id
                modulesById[decl.id] = parseModule(decl.id, next.value)

                modulesById[currentModule].rs2f += next.value
            } else if (isInputDeclaration(next)) {
                // define MUST come after the input declaration
                if (
                    !tokens.hasTokens() ||
                    tokens.peek()!!.type !== TokenType.PREPROC_DEFINE
                ) {
                    throw new Error(
                        `missing define after block comment on line ${next.location.line}`
                    )
                }

                const define = new TokenStream([
                    tokens.takeExpect(TokenType.PREPROC_DEFINE),
                    ...tokens.takeLine().getTokens(),
                ])

                // capture source before parseInput consumes token stream
                const defineSource = define.toString()

                const input = parseInput(next.value, define)
                const module = modulesById[currentModule]
                module.inputs.push(input)

                modulesById[currentModule].rs2f += next.value + '\n'
                modulesById[currentModule].rs2f += defineSource + '\n'
            } else {
                modulesById[currentModule].rs2f +=
                    next.type === TokenType.LITERAL_STRING
                        ? `"${next.value}"`
                        : next.value
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
            rs2fHash: '00000000',
            ...(metaContentOverride || {}),
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
                    error: new Error(
                        'Failed to parse filter - do you have a meta block?',
                        {
                            cause: e,
                        }
                    ),
                },
            ],
            filter: undefined,
        }
    }
}

export const parseAsync = async (
    filterText: string,
    addHeaderModule: boolean = false
): Promise<ParseResult> => {
    const result = parse(filterText, addHeaderModule)
    if (result.errors) {
        return Promise.resolve(result)
    }

    return { filter: await addRs2fHash(result.filter!!) }
}

export const addRs2fHash = async (filter: Filter) => {
    const filterBytes = new TextEncoder().encode(filter.rs2f)
    const hashBuffer = await window.crypto.subtle.digest('SHA-1', filterBytes)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const rs2fHash = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

    return { ...filter, rs2fHash }
}
