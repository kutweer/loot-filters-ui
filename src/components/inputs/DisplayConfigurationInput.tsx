import { ExpandMore } from '@mui/icons-material'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Checkbox,
    FormControlLabel,
    Grid2 as Grid,
    TextField,
} from '@mui/material'
import React, { useState } from 'react'
import {
    FilterConfiguration,
    Module,
    StyleConfig,
    StyleConfigSpec,
    StyleInput,
} from '../../parsing/UiTypesSpec'
import { useFilterConfigStore } from '../../store/filterConfigurationStore'
import { useFilterStore } from '../../store/filterStore'
import { useSiteConfigStore } from '../../store/siteConfigStore'
import { colors } from '../../styles/MuiTheme'
import { ArgbHexColor } from '../../utils/Color'
import { ItemLabelPreview, ItemMenuPreview } from '../Previews'
import { ColorPickerInput } from './ColorPicker'
import { ItemLabelColorPicker } from './ItemLabelColorPicker'

export const DisplayConfigurationInput: React.FC<{
    config: FilterConfiguration
    onChange: (style: StyleConfig) => void
    readonly: boolean
    module: Module
    input: StyleInput
}> = ({ config, onChange, readonly, module, input }) => {
    const { siteConfig } = useSiteConfigStore()
    const [expanded, setExpanded] = useState(siteConfig.devMode)

    const styleConfig = StyleConfigSpec.optional()
        .default({})
        .parse(config?.inputConfigs?.[input.macroName])

    const { updateInputConfiguration } = useFilterConfigStore()

    const itemLabelColorPicker = (
        <Grid size={{ xs: 12, md: 12 }} sx={{ display: 'flex', padding: 1 }}>
            <ItemLabelColorPicker
                readonly={readonly}
                config={config}
                onChange={(style: StyleConfig) => onChange(style)}
                showExamples={false}
                labelLocation="right"
                input={input}
            />
        </Grid>
    )

    const lootbeamComponent = (
        <Grid size={3} sx={{ display: 'flex', padding: 1 }}>
            <FormControlLabel
                label="Lootbeam"
                control={
                    <Checkbox
                        checked={
                            styleConfig.showLootbeam ??
                            input.default?.showLootbeam
                        }
                        onChange={(e) =>
                            onChange({ showLootbeam: e.target.checked })
                        }
                    />
                }
            />
            <ColorPickerInput
                disabled={
                    !(styleConfig.showLootbeam ?? input.default?.showLootbeam)
                }
                color={
                    styleConfig.lootbeamColor ?? input.default?.lootbeamColor
                }
                onChange={(color?: ArgbHexColor) =>
                    onChange({ lootbeamColor: color })
                }
                labelText={'Lootbeam Color'}
                labelLocation="right"
            />
        </Grid>
    )

    const valueComponent = (
        <FormControlLabel
            label="Show Item Value"
            control={
                <Checkbox
                    checked={styleConfig.showValue ?? input.default?.showValue}
                    onChange={(e) => onChange({ showValue: e.target.checked })}
                />
            }
        />
    )

    const despawnComponent = (
        <FormControlLabel
            label="Show Despawn Timer"
            control={
                <Checkbox
                    checked={
                        styleConfig.showDespawn ?? input.default?.showDespawn
                    }
                    onChange={(e) => onChange({ showDespawn: e.target.checked })}
                />
            }
        />
    )

    const notifyComponent = (
        <FormControlLabel
            label="Notify on Drop"
            control={
                <Checkbox
                    checked={styleConfig.notify ?? input.default?.notify}
                    onChange={(e) => onChange({ notify: e.target.checked })}
                />
            }
        />
    )

    const hideOverlayComponent = (
        <FormControlLabel
            label="Hide Overlay"
            control={
                <Checkbox
                    checked={
                        styleConfig.hideOverlay ?? input.default?.hideOverlay
                    }
                    onChange={(e) => onChange({ hideOverlay: e.target.checked })}
                />
            }
        />
    )

    const highlightTileComponent = (
        <Grid size={5} sx={{ display: 'flex', gap: 2, padding: 1 }}>
            <FormControlLabel
                label="Highlight Tile"
                control={
                    <Checkbox
                        checked={
                            styleConfig.highlightTile ??
                            input.default?.highlightTile
                        }
                        onChange={(e) => onChange({ highlightTile: e.target.checked })}
                    />
                }
            />
            <ColorPickerInput
                color={
                    styleConfig.tileStrokeColor ??
                    input.default?.tileStrokeColor
                }
                onChange={(color?: ArgbHexColor) =>
                    onChange({ tileStrokeColor: color })
                }
                labelText={'Tile Stroke Color'}
                labelLocation="right"
                disabled={
                    !(styleConfig.highlightTile ?? input.default?.highlightTile)
                }
            />
            <ColorPickerInput
                color={
                    styleConfig.tileFillColor ?? input.default?.tileFillColor
                }
                onChange={(color?: ArgbHexColor) =>
                    onChange({ tileFillColor: color })
                }
                labelText={'Tile Fill Color'}
                labelLocation="right"
                disabled={
                    !(styleConfig.highlightTile ?? input.default?.highlightTile)
                }
            />
        </Grid>
    )

    const soundFileInput = (
        <TextField
            label="Sound File"
            value={styleConfig?.sound ?? input.default?.sound ?? ''}
            onChange={(e) => onChange({ sound: e.target.value })}
        />
    )

    const inputComponents = [
        // Row 1
        itemLabelColorPicker,
        // Row 2
        lootbeamComponent,
        <Grid size={2}></Grid>,
        highlightTileComponent,
        <Grid size={2}></Grid>,
        valueComponent,
        despawnComponent,
        notifyComponent,
        hideOverlayComponent,
        soundFileInput,
    ]

    return (
        <Accordion
            sx={{
                backgroundColor: colors.rsLightBrown,
            }}
            slotProps={{ transition: { unmountOnExit: true } }}
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
        >
            <AccordionSummary
                sx={{
                    backgroundColor: colors.rsLighterBrown,
                }}
                expandIcon={<ExpandMore />}
            >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <ItemLabelPreview input={input} itemName={input.label} />
                    <ItemMenuPreview input={input} itemName={input.label} />
                </Box>
            </AccordionSummary>
            <AccordionDetails
                sx={{
                    backgroundColor: colors.rsLighterBrown,
                }}
            >
                <Grid container spacing={2}>
                    {inputComponents.map((component, index) => {
                        if (component.type.muiName === 'Grid') {
                            return React.cloneElement(component, {
                                key: index,
                            })
                        }
                        return (
                            <Grid sx={{ padding: 1 }} size={3} key={index}>
                                {component}
                            </Grid>
                        )
                    })}
                </Grid>
            </AccordionDetails>
        </Accordion>
    )
}
