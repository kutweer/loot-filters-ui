import { z } from 'zod'
import { loadGzippedJson } from '../../utils/decompress'

const IconRecordSpec = z.object({
    id: z.number(),
    name: z.string(),
    iconPng: z.string(),
})

export type IconRecord = z.infer<typeof IconRecordSpec>

const spritesUrl = require('./sprites.json.gz')
const iconsUrl = require('./icons.json.gz')

declare global {
    interface Window {
        osrs_sprites: Array<Array<string>> | undefined
        osrs_icons: Array<IconRecord> | undefined
    }
}

const toPng = (b64Data?: string): HTMLImageElement | undefined => {
    if (!b64Data) {
        return undefined
    }

    const image = new Image()
    image.src = `data:image/png;base64,${b64Data}`
    return image
}

export const initImages = () => {
    if (window.osrs_sprites) {
        return
    } else {
        loadGzippedJson<Array<Array<string>>>(spritesUrl).then((sprites) => {
            window.osrs_sprites = sprites
        })
    }
    if (window.osrs_icons) {
        return
    } else {
        loadGzippedJson<{ byId: Array<IconRecord> }>(iconsUrl).then((icons) => {
            window.osrs_icons = icons['byId']
        })
    }
}

export const getIcon = async (
    id: number | string,
    setIcon: (icon: HTMLImageElement | undefined) => void
) => {
    if (!window.osrs_icons) {
        setTimeout(() => {
            getIcon(id, setIcon)
        }, 100)
        return
    }

    let iconId = id
    if (typeof id === 'string') {
        const parsed = parseInt(id)
        if (isNaN(parsed)) {
            return setIcon(undefined)
        }
        iconId = parsed
    }

    console.log('icons', window.osrs_icons)

    return setIcon(
        toPng(window.osrs_icons.find((icon) => icon.id === iconId)?.iconPng)
    )
}

export const getSprite = async (
    id: number,
    idx: number,
    setIcon: (icon: HTMLImageElement | undefined) => void
) => {
    if (!window.osrs_sprites) {
        setTimeout(() => {
            getSprite(id, idx, setIcon)
        }, 100)
        return
    }

    const sprites = window.osrs_sprites

    const b64Data = sprites[id]?.[idx]
    if (!b64Data) {
        return setIcon(undefined)
    }
    return setIcon(toPng(b64Data))
}
