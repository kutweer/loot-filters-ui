export type ArgbHexColor = string

export type Color = {
    r: string
    g: string
    b: string
    a: string
}

export const argbToParts = (hex?: ArgbHexColor) => {
    if (!hex) {
        return hex
    }
    const a = parseInt(hex.slice(1, 3), 16)
    const r = parseInt(hex.slice(3, 5), 16)
    const g = parseInt(hex.slice(5, 7), 16)
    const b = parseInt(hex.slice(7, 9), 16)
    return [r, g, b, a]
}

export const normalizeHex = (hex?: ArgbHexColor): ArgbHexColor | undefined => {
    if (!hex) {
        return hex
    }

    let argbHex: ArgbHexColor
    if (hex.length === 7) {
        argbHex = `#ff${hex.slice(1)}`
    } else if (hex.length === 9) {
        argbHex = hex
    } else {
        console.warn(`Invalid color hex: ${hex}`)
        return '#FF000000'
    }

    return argbHex
}

export const colorHexToRgbaCss = (hex?: ArgbHexColor) => {
    const argbHex = normalizeHex(hex)
    if (!hex) {
        return hex
    }

    const [r, g, b, a] = argbToParts(argbHex) as number[]
    return `rgba(${r}, ${g}, ${b}, ${a / 255})`
}

type RGBAColor = {
    r: number
    g: number
    b: number
    a: number
}

export const argbHexColorToRGBColor = (
    hex?: ArgbHexColor
): RGBAColor | undefined => {
    const argbHex = normalizeHex(hex)
    if (!argbHex) {
        return undefined
    }
    const [r, g, b, a] = argbToParts(argbHex) as number[]
    return { r, g, b, a: a / 255.0 }
}
