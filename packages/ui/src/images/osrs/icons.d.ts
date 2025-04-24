declare module '*/icons.json' {
    interface Icons {
        byId: Array<IconRecord>
    }
    const value: Icons
    export = value
}

declare module '*/icons.json.gz' {
    const value: string
    export = value
}
