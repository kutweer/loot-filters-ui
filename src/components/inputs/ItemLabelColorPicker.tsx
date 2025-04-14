import { Divider } from '@mui/material'
import { Module, StyleConfig, StyleInput } from '../../parsing/UiTypesSpec'
import { useFilterConfigStore, useFilterStore } from '../../store/storeV2'
import { colors } from '../../styles/MuiTheme'
import {
    FontType,
    fontTypes,
    labelFromFontType,
    labelFromTextAccent,
    TextAccent,
    textAccents,
} from '../../types/Rs2fEnum'
import { ArgbHexColor } from '../../utils/Color'
import { ItemLabelPreview, ItemMenuPreview } from '../Previews'
import { ColorPickerInput } from './ColorPicker'
import { Option, UISelect } from './UISelect'

export const ItemLabelColorPicker: React.FC<{
    input: StyleInput
    itemName?: string
    showExamples?: boolean
    labelLocation?: 'right' | 'bottom'
}> = ({
    input,
    itemName = 'Example',
    showExamples = true,
    labelLocation = 'bottom',
}) => {
    const activeFilterId = useFilterStore(
        (state) =>
            Object.keys(state.filters).find((id) => state.filters[id].active)!!
    )

    const activeConfig = useFilterConfigStore(
        (state) =>
            state.filterConfigurations[activeFilterId]?.inputConfigs?.[
                input.macroName
            ]
    )

    const updateInputConfiguration = useFilterConfigStore(
        (state) => state.updateInputConfiguration
    )

    const updateStyleField = (
        field: keyof StyleConfig,
        value: StyleConfig[keyof StyleConfig]
    ) => {
        updateInputConfiguration(activeFilterId, input.macroName, {
            [field]: value,
        })
    }

    const fontTypeOptions = fontTypes.map<Option<FontType>>((type) => ({
        label: labelFromFontType(type),
        value: type,
    }))

    const textAccentOptions = textAccents.map<Option<TextAccent>>((accent) => ({
        label: labelFromTextAccent(accent),
        value: accent,
    }))

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 8,
                width: '100%',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
            }}
        >
            <ColorPickerInput
                color={activeConfig?.textColor ?? input.default?.textColor}
                labelText="Text Color"
                onChange={(color?: ArgbHexColor) =>
                    updateStyleField('textColor', color)
                }
                labelLocation={labelLocation}
            />
            <ColorPickerInput
                color={
                    activeConfig?.backgroundColor ??
                    input.default?.backgroundColor
                }
                labelText="Background"
                onChange={(color?: ArgbHexColor) =>
                    updateStyleField('backgroundColor', color)
                }
                labelLocation={labelLocation}
            />
            <ColorPickerInput
                color={activeConfig?.borderColor ?? input.default?.borderColor}
                labelText="Border"
                onChange={(color?: ArgbHexColor) =>
                    updateStyleField('borderColor', color)
                }
                labelLocation={labelLocation}
            />

            <Divider
                sx={{ marginLeft: 'auto', borderColor: colors.rsLightBrown }}
                orientation="vertical"
                flexItem
            />

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 8,
                    marginLeft: 'auto',
                }}
            >
                <div style={{ minWidth: '200px', flex: '0 0 auto' }}>
                    <UISelect<number>
                        options={fontTypeOptions}
                        label="Overlay Font Type"
                        multiple={false}
                        freeSolo={false}
                        value={{
                            label: labelFromFontType(
                                activeConfig?.fontType ??
                                    input.default?.fontType ??
                                    FontType.Small // Default to small
                            ),
                            value:
                                activeConfig?.fontType ??
                                input.default?.fontType ??
                                1,
                        }}
                        onChange={(newValue) => {
                            if (newValue === null) {
                                updateStyleField('fontType', undefined)
                            } else {
                                updateStyleField(
                                    'fontType',
                                    newValue.value as FontType
                                )
                            }
                        }}
                    />
                </div>
                <ColorPickerInput
                    color={
                        activeConfig?.menuTextColor ??
                        input.default?.menuTextColor
                    }
                    labelText="Menu Text Color"
                    onChange={(color?: ArgbHexColor) =>
                        updateStyleField('menuTextColor', color)
                    }
                    labelLocation={labelLocation}
                />
            </div>

            <Divider
                sx={{ marginLeft: 'auto', borderColor: colors.rsLightBrown }}
                orientation="vertical"
                flexItem
            />

            <div style={{ marginLeft: 'auto', alignSelf: 'center' }}>
                <ColorPickerInput
                    color={
                        activeConfig?.textAccentColor ??
                        input.default?.textAccentColor
                    }
                    labelText="Text Accent Color"
                    onChange={(color?: ArgbHexColor) =>
                        updateStyleField('textAccentColor', color)
                    }
                    labelLocation={labelLocation}
                    helpText={
                        (activeConfig?.textAccent ??
                            input.default?.textAccent) ==
                            3 /* must be == not === idk why */ &&
                        activeConfig?.textAccentColor !== undefined
                            ? 'Warning: Text accent color is set but text accent is None'
                            : undefined
                    }
                />
            </div>

            <div style={{ minWidth: '200px', flex: '0 0 auto' }}>
                <UISelect<number>
                    options={textAccentOptions}
                    label="Text Accent"
                    multiple={false}
                    freeSolo={false}
                    value={{
                        label: labelFromTextAccent(
                            activeConfig?.textAccent ??
                                input.default?.textAccent ??
                                TextAccent.Shadow // Default to shadow
                        ),
                        value:
                            activeConfig?.textAccent ??
                            input.default?.textAccent ??
                            1, // Default to shadow
                    }}
                    onChange={(newValue) => {
                        if (newValue === null) {
                            updateStyleField('textAccent', undefined)
                        } else {
                            updateStyleField(
                                'textAccent',
                                newValue.value as TextAccent
                            )
                        }
                    }}
                />
            </div>

            {showExamples && (
                <>
                    <div style={{ minWidth: '200px', flex: '0 0 auto' }}>
                        <ItemLabelPreview input={input} itemName={itemName} />
                    </div>
                    <div style={{ minWidth: '200px', flex: '0 0 auto' }}>
                        <ItemMenuPreview input={input} itemName={itemName} />
                    </div>
                </>
            )}
        </div>
    )
}
