import { Box, SxProps } from '@mui/material'
import AbyssalNexusImage from '../images/abyssal_nexus.png'
import BareGroundImage from '../images/bare_ground.png'
import CatacombsOfKourendImage from '../images/catacombs_of_kourend.png'
import ChambersOfXericImage from '../images/chambers_of_xeric.png'
import GodWarsDungeonImage from '../images/god_wars_dungeon.png'
import GrassImage from '../images/grass.png'
import NightmareImage from '../images/nightmare.png'
import SandImage from '../images/sand.png'
import ScarImage from '../images/scar.png'
import TzhaarImage from '../images/tzhaar.png'
import UndercityImage from '../images/undercity.png'
import WildernessImage from '../images/wilderness.png'
import ZanarisImage from '../images/zanaris.png'
import ZulAndraImage from '../images/zul_andra.png'

import { useEffect, useState } from 'react'
import { useBackgroundStore } from '../store/background'
import { useUiStore } from '../store/store'
import { colors } from '../styles/MuiTheme'
import { BackgroundImage, imageFromBackgroundImage } from '../types/Images'
import { fontFamilyFromFontType, StyleInput } from '../types/InputsSpec'
import { UiFilterModule } from '../types/ModularFilterSpec'
import { colorHexToRgbaCss } from '../utils/Color'
import { StyleConfig } from './inputs/StyleInputHelpers'

export const ItemMenuPreview: React.FC<{
    itemName: string
    input: StyleInput
    module: UiFilterModule
}> = ({ itemName, input, module }) => {
    const activeFilterId = useUiStore(
        (state) =>
            Object.keys(state.importedModularFilters).find(
                (id) => state.importedModularFilters[id].active
            )!!
    )

    const activeConfig = useUiStore(
        (state) =>
            state.filterConfigurations?.[activeFilterId!!]?.inputConfigs?.[
                input.macroName
            ] as Partial<StyleConfig>
    )

    const menuTextColor = colorHexToRgbaCss(
        activeConfig?.menuTextColor ?? input.default?.menuTextColor
    )

    return (
        <Box>
            <div
                style={{
                    display: 'flex',
                    backgroundColor: colors.rsLightBrown,
                    border: `1px solid ${colors.rsLightBrown}`,
                }}
            >
                <div
                    style={{
                        borderRadius: '2px',
                    }}
                >
                    <div
                        style={{
                            color: colors.rsLightBrown,
                            fontFamily: 'RuneScape',
                            fontSize: '24px',
                            border: `1px solid ${colors.rsLightBrown}`,
                            borderRadius: '2px',
                            backgroundColor: colors.rsBlack,
                        }}
                    >
                        Choose Option
                    </div>
                    <div
                        style={{
                            border: `2px solid ${colors.rsBlack}`,
                            backgroundColor: colors.rsLightBrown,
                        }}
                    >
                        <div style={{ margin: '2px' }}>
                            <span
                                style={{
                                    color: colors.rsWhite,
                                    fontFamily: 'RuneScapeSmall',
                                    fontSize: '24px',
                                }}
                            >
                                Take{' '}
                            </span>
                            <span
                                style={{
                                    color: menuTextColor,
                                    fontFamily: 'RuneScapeSmall',
                                    fontSize: '24px',
                                }}
                            >
                                {input.exampleItem || itemName || 'Item Name'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    )
}

const backgroundImages = [
    AbyssalNexusImage,
    BareGroundImage,
    CatacombsOfKourendImage,
    ChambersOfXericImage,
    GodWarsDungeonImage,
    GrassImage,
    NightmareImage,
    SandImage,
    ScarImage,
    TzhaarImage,
    UndercityImage,
    WildernessImage,
    ZanarisImage,
    ZulAndraImage,
]
export const ItemLabelPreview: React.FC<{
    itemName: string
    input: StyleInput
    module: UiFilterModule
    sx?: SxProps
}> = ({ itemName, input, module, sx }) => {
    const activeFilterId = useUiStore(
        (state) =>
            Object.keys(state.importedModularFilters).find(
                (id) => state.importedModularFilters[id].active
            )!!
    )

    const activeConfig = useUiStore(
        (state) =>
            state.filterConfigurations?.[activeFilterId!!]?.inputConfigs?.[
                input.macroName
            ] as Partial<StyleConfig>
    )

    const backgroundColor = colorHexToRgbaCss(
        activeConfig?.backgroundColor ?? input.default?.backgroundColor
    )
    const borderColor = colorHexToRgbaCss(
        activeConfig?.borderColor ?? input.default?.borderColor
    )
    const foregroundColor = colorHexToRgbaCss(
        activeConfig?.textColor ?? input.default?.textColor
    )

    const hidden =
        activeConfig?.hideOverlay ?? input.default?.hideOverlay ?? false

    const fontType = activeConfig?.fontType ?? input.default?.fontType
    const fontFamily = fontFamilyFromFontType(fontType)

    const textAccent = activeConfig?.textAccent ?? input.default?.textAccent

    const textAccentColor =
        activeConfig?.textAccentColor ?? input.default?.textAccentColor

    let textAccentStyle: React.CSSProperties & {
        webkitTextStroke?: string
    } = {}
    switch (textAccent) {
        // Outline
        case 2:
            textAccentStyle = {
                WebkitTextStroke: `1px ${colorHexToRgbaCss(textAccentColor) ?? 'rgb(0,0,0,0)'}`,
            }
            break
        // None
        case 3:
            textAccentStyle = {}
            break
        // Shadow Bold
        case 4:
            textAccentStyle = {
                textShadow: '2px 2px #000000',
            }
            break
        // Shadow is default
        case 1:
        default:
            textAccentStyle = {
                textShadow: '1px 1px #000000',
            }
            break
    }

    const [randomBackgroundImageIndex, setBackgroundImageIndex] = useState(
        Math.floor(Math.random() * backgroundImages.length)
    )

    const activeBackground = useBackgroundStore((state) => state.background)

    useEffect(() => {
        if (activeBackground === BackgroundImage.Random) {
            const interval = window.setInterval(
                () => {
                    setBackgroundImageIndex(
                        Math.floor(Math.random() * backgroundImages.length)
                    )
                },
                Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000
            )

            return () => {
                clearInterval(interval)
            }
        }
    }, [activeBackground])

    const activeBackgroundImage =
        activeBackground === BackgroundImage.Random
            ? backgroundImages[randomBackgroundImageIndex]
            : imageFromBackgroundImage(activeBackground)

    return (
        <div
            style={{
                border: '3px solid #2c2721',
                backgroundRepeat: 'repeat',
                backgroundPosition: 'center',
                backgroundImage: `url(${activeBackgroundImage})`,
            }}
        >
            {hidden && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        color: '#ffffff',
                        fontFamily: 'RuneScapeSmall',
                        fontSize: '20px',
                        pointerEvents: 'none',
                        zIndex: 1,
                    }}
                >
                    Hidden
                </div>
            )}
            <div
                style={{
                    margin: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    backgroundColor: backgroundColor,
                    border: `1px solid ${borderColor}`,
                    ...textAccentStyle,
                }}
            >
                <span
                    style={{
                        padding: '4px',
                        color: foregroundColor ?? '#ffffff',
                        fontSize: '24px',
                        fontFamily: fontFamily,
                    }}
                >
                    {input.exampleItem || itemName || 'Item Name'}
                </span>
            </div>
        </div>
    )
}
