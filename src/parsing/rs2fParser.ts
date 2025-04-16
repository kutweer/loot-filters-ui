export type Rs2fValue =
    | string
    | number
    | boolean
    | string[]
    | number[]
    | { [key: string]: string }
    | null
export type Rs2fDefine = {
    name: string
    value: Rs2fValue
    type:
        | 'style'
        | 'number'
        | 'string'
        | 'stringlist'
        | 'numberlist'
        | 'boolean'
        | 'null'
}

const isList = (valueStr: string): boolean => {
    return valueStr.startsWith('[') && valueStr.endsWith(']')
}

const parseList = (
    valueStr: string
): { value: string[] | number[]; type: 'stringlist' | 'numberlist' } => {
    const listStr = valueStr.slice(1, -1)

    if (listStr.trim() === '') {
        return { value: [], type: 'stringlist' }
    }
    const items = listStr
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '')
    if (items.every((item) => /^-?\d+$/.test(item))) {
        return { value: items.map(Number), type: 'numberlist' }
    }

    return {
        value: items.map((item) => item.replace(/^"|"$/g, '')),
        type: 'stringlist',
    }
}

const isStyle = (valueStr: string): boolean => {
    return valueStr.includes(';')
}

const parseStyle = (valueStr: string): { [key: string]: string } => {
    const styleObj: { [key: string]: string } = {}
    const parts = valueStr
        .split(';')
        .map((part) => part.trim())
        .filter(Boolean)

    for (const part of parts) {
        const [key, value] = part.split('=').map((s) => s.trim())
        const cleanValue = value.replace(/^"|"$/g, '')
        const cleanKey = key.replace(/\\n\s*/g, '')

        // Convert string values to numbers or booleans if applicable
        let parsedValue: any = cleanValue
        if (cleanValue === 'true' || cleanValue === 'false') {
            parsedValue = cleanValue === 'true'
        } else if (/^-?\d+$/.test(cleanValue)) {
            parsedValue = Number(cleanValue)
        }

        styleObj[cleanKey] = parsedValue
    }

    return styleObj
}

const isBoolean = (valueStr: string): boolean => {
    return valueStr === 'true' || valueStr === 'false'
}

const parseBoolean = (valueStr: string): boolean => {
    return valueStr === 'true'
}

const isNumber = (valueStr: string): boolean => {
    return /^-?\d+$/.test(valueStr)
}

const parseNumber = (valueStr: string): number => {
    return Number(valueStr)
}

const parseString = (valueStr: string): string => {
    return valueStr.replace(/^"|"$/g, '')
}

export const parseDefine = (line: string, lineNumber: number): Rs2fDefine => {
    const match = line.match(/^#define\s+([A-Z0-9_]+)(\s+(.*))?$/)

    if (!match) {
        throw new Error(
            `Invalid define expression: '${line}' at line #${lineNumber}`
        )
    }

    const [, name, valueStrFull] = match
    const valueStr = valueStrFull?.trim()

    if (!valueStr) {
        return { name, value: null, type: 'null' }
    }

    try {
        if (isList(valueStr)) {
            const { value, type } = parseList(valueStr)
            return { name, value, type }
        }

        if (isStyle(valueStr)) {
            return { name, value: parseStyle(valueStr), type: 'style' }
        }

        if (isBoolean(valueStr)) {
            return {
                name,
                value: parseBoolean(valueStr),
                type: 'boolean',
            }
        }

        if (isNumber(valueStr)) {
            return { name, value: parseNumber(valueStr), type: 'number' }
        }

        return { name, value: parseString(valueStr), type: 'string' }
    } catch (error) {
        throw new Error((error as Error).toString())
    }
}

// Function to parse the name field from the meta block
export const parseMetaName = (content: string): string | null => {
    const metaBlockRegex = /meta\s*{([^}]*)}/ // Matches the meta block
    const nameRegex = /name\s*=\s*"([^"]*)"/ // Matches the name field

    const metaBlockMatch = content.match(metaBlockRegex)
    if (metaBlockMatch) {
        const metaBlockContent = metaBlockMatch[1] // Extract the content inside the meta block
        const nameMatch = metaBlockContent.match(nameRegex)
        if (nameMatch) {
            return nameMatch[1] // Return the name value
        }
    }

    return null // Return null if no name is found
}

// Function to parse the description field from the meta block
export const parseMetaDescription = (content: string): string | null => {
    const metaBlockRegex = /meta\s*{([^}]*)}/ // Matches the meta block
    const descriptionRegex = /description\s*=\s*"([^"]*)"/ // Matches the description field

    const metaBlockMatch = content.match(metaBlockRegex)
    if (metaBlockMatch) {
        const metaBlockContent = metaBlockMatch[1] // Extract the content inside the meta block
        const descriptionMatch = metaBlockContent.match(descriptionRegex)
        if (descriptionMatch) {
            return descriptionMatch[1] // Return the description value
        }
    }

    return null // Return null if no description is found
}
