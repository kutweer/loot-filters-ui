import { Token, TokenType } from './token'

/**
 * Manipulator for a stream of tokens returned from lexing.
 *
 * This is conceptually equivalent to, BUT behaviorally different from the
 * plugin version of TokenStream - that one ignores comments and needs a bunch
 * more logic for handling expressions, etc. - this one _needs_ comments and
 * not much else.
 */
export class TokenStream {
    private readonly tokens: Token[]

    constructor(tokens: Token[]) {
        this.tokens = [...tokens]
    }

    getTokens(): Token[] {
        return [...this.tokens]
    }

    hasTokens(): boolean {
        return this.peek() !== undefined
    }

    /**
     * Peek at the first non-whitespace token in the stream without consuming
     * it.
     */
    peek(): Token | undefined {
        return this.tokens.find((t) => !isWhitespace(t))
    }

    /**
     * Consume the first token in the stream, optionally including whitespace.
     */
    take(includeWhitespace?: boolean): Token | undefined {
        while (this.tokens.length !== 0) {
            const next = this.tokens.shift()
            if (includeWhitespace || !isWhitespace(next)) {
                return next
            }
        }
    }

    /**
     * Consume the first non-whitespace token in the stream while asserting
     * that it is of the given type.
     */
    takeExpect(expect: TokenType): Token {
        if (this.tokens.length === 0) {
            throw new Error('unexpected end of token stream')
        }

        const first = this.take()
        if (first?.type !== expect) {
            throw new Error('unexpected token' + first)
        }
        return first
    }

    /**
     * Take a complete line from the stream, including whitespace, and
     * excluding the newline at the end.
     */
    takeLine(): TokenStream {
        const line: Token[] = []
        while (this.tokens.length !== 0) {
            const next = this.tokens.shift()!!
            if (next.type === TokenType.NEWLINE) {
                return new TokenStream(line)
            }
            line.push(next)
        }
        return new TokenStream(line)
    }

    toString(): string {
        return this.tokens
            .map((t) =>
                t.type === TokenType.LITERAL_STRING ? `"${t.value}"` : t.value
            )
            .join('')
    }
}

export function isWhitespace(token?: Token): boolean {
    return (
        token?.type === TokenType.WHITESPACE ||
        token?.type === TokenType.NEWLINE
    )
}
