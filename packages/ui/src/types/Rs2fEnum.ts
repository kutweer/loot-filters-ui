/**
 * @see https://github.com/riktenx/loot-filters/blob/bec89ccfee8f85fab8c8b1dc9da49f972c2316fb/src/main/java/com/lootfilters/rule/FontType.java#L15
 */
export const TextAccent = {
    Shadow: 1,
    Outline: 2,
    None: 3,
    ShadowBold: 4,
} as const
export type TextAccent = (typeof TextAccent)[keyof typeof TextAccent]

export const textAccents = Object.values<TextAccent>(TextAccent)

export const labelFromTextAccent = (textAccent: TextAccent) => {
    switch (textAccent) {
        case TextAccent.Shadow:
            return 'Shadow'
        case TextAccent.Outline:
            return 'Outline'
        case TextAccent.None:
            return 'None'
        case TextAccent.ShadowBold:
            return 'Bold Shadow'
    }
}

export const fontFamilyFromFontType = (fontType?: FontType) => {
    switch (fontType) {
        case 1:
            return 'RuneScapeSmall'
        case 2:
            return 'RuneScape'
        case 3:
            return 'RuneScapeBold'
        default:
            return 'RuneScapeSmall'
    }
}

/**
 * @see https://github.com/riktenx/loot-filters/blob/bec89ccfee8f85fab8c8b1dc9da49f972c2316fb/src/main/java/com/lootfilters/rule/FontType.java#L15

 */
export const FontType = {
    Small: 1,
    Normal: 2,
    Bold: 3,
} as const
export type FontType = (typeof FontType)[keyof typeof FontType]

export const fontTypes = Object.values<FontType>(FontType)

export const labelFromFontType = (fontType: FontType) => {
    switch (fontType) {
        case FontType.Small:
            return 'Small'
        case FontType.Normal:
            return 'Normal'
        case FontType.Bold:
            return 'Bold'
    }
}
