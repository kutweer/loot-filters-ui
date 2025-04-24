import { z } from 'zod'

const sprites = require('./sprites.json')
const icons: Array<IconRecord> = require('./icons.json')['byId']

const IconRecordSpec = z.object({
    id: z.number(),
    name: z.string(),
    iconPng: z.string(),
})

export type IconRecord = z.infer<typeof IconRecordSpec>

export const toPng = (b64Data?: string): HTMLImageElement | undefined => {
    if (!b64Data) {
        return undefined
    }

    const image = new Image()
    image.src = `data:image/png;base64,${b64Data}`
    return image
}

export const getIcon = (id: number | string): HTMLImageElement | undefined => {
    let iconId = id
    if (typeof id === 'string') {
        const parsed = parseInt(id)
        if (isNaN(parsed)) {
            return undefined
        }
        iconId = parsed
    }

    return toPng(icons.find((icon) => icon.id === iconId)?.iconPng)
}

export const getSprite = (
    id: number,
    idx: number
): HTMLImageElement | undefined => {
    const b64Data = sprites[id]?.[idx]
    if (!b64Data) {
        return undefined
    }
    return toPng(b64Data)
}
