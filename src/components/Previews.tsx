import { Box, SxProps } from '@mui/material'
import { useUiStore } from '../store/store'
import { colors } from '../styles/MuiTheme'
import {
    FontType,
    fontTypeFromOrdinal,
    StyleInput,
    TextAccent,
    textAccentFromOrdinal,
} from '../types/InputsSpec'
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
            state.filterConfigurations?.[activeFilterId!!]?.[module.id]?.[
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
            state.filterConfigurations?.[activeFilterId!!]?.[module.id]?.[
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
    const fontFamily =
        fontTypeFromOrdinal(fontType) === FontType.NORMAL
            ? 'RuneScapeSmall'
            : fontTypeFromOrdinal(fontType) === FontType.BOLD
              ? 'RuneScapeBold'
              : fontTypeFromOrdinal(fontType) === FontType.LARGER
                ? 'RuneScape'
                : 'RuneScapeSmall'

    const textAccentOrdinal =
        activeConfig?.textAccent ?? input.default?.textAccent
    const textAccent =
        textAccentFromOrdinal(textAccentOrdinal) ?? TextAccent.SHADOW

    const textAccentColor =
        activeConfig?.textAccentColor ?? input.default?.textAccentColor

    let textAccentStyle: React.CSSProperties & {
        webkitTextStroke?: string
    } = {}
    switch (textAccent) {
        case TextAccent.SHADOW:
            textAccentStyle = {
                textShadow: '1px 1px #000000',
            }
            break
        case TextAccent.OUTLINE:
            textAccentStyle = {
                WebkitTextStroke: `1px ${colorHexToRgbaCss(textAccentColor) ?? 'rgb(0,0,0,0)'}`,
            }
            break
        case TextAccent.SHADOW_BOLD:
            textAccentStyle = {
                textShadow: '2px 2px #000000',
            }
            break
        case TextAccent.NONE:
            textAccentStyle = {}
            break
    }

    return (
        <Box
            sx={{
                border: '3px solid black',
                backgroundColor: '#dddddd',
                height: 'min-content',
                position: 'relative',
                ...sx,
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
        </Box>
    )
}
