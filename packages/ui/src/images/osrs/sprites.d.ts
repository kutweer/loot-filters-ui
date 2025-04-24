declare module '*/sprites.json' {
    interface Sprites {
        byId: Array<Array<string>>
    }
    const value: Sprites
    export = value
}

declare module '*/sprites.json.gz' {
    interface Sprites {
        byId: Array<Array<string>>
    }
    const value: Sprites
    export = value
}
