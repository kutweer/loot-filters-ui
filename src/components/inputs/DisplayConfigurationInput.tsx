import { ExpandMore, MacroOff } from '@mui/icons-material'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid2 as Grid,
    TextField,
} from '@mui/material'
import React, { useState } from 'react'
import { useUiStore } from '../../store/store'
import { colors } from '../../styles/MuiTheme'
import { StyleInput } from '../../types/InputsSpec'
import { UiFilterModule } from '../../types/ModularFilterSpec'
import { ArgbHexColor } from '../../utils/Color'
import { ItemLabelPreview, ItemMenuPreview } from '../Previews'
import { ColorPickerInput } from './ColorPicker'
import { ItemLabelColorPicker } from './ItemLabelColorPicker'
import { StyleConfig } from './StyleInputHelpers'
import { TextInputComponent } from './TextInputComponent'

export const DisplayConfigurationInput: React.FC<{
    module: UiFilterModule
    input: StyleInput
}> = ({ module, input }) => {
    const { siteConfig } = useUiStore()
    const [expanded, setExpanded] = useState(siteConfig.devMode)

    const activeFilterId = useUiStore(
        (state) =>
            Object.keys(state.importedModularFilters).find(
                (id) => state.importedModularFilters[id].active
            )!!
    )

    const styleConfig: Partial<StyleConfig> = useUiStore(
        (state) =>
            state.filterConfigurations?.[activeFilterId]?.inputConfigs?.[
                input.macroName
            ] as Partial<StyleConfig>
    ) ?? { [input.macroName]: {} }

    const setFilterConfiguration = useUiStore(
        (state) => state.setFilterConfiguration
    )

    const itemLabelColorPicker = (
        <Grid size={{ xs: 12, md: 12 }} sx={{ display: 'flex', padding: 1 }}>
            <ItemLabelColorPicker
                showExamples={false}
                labelLocation="right"
                module={module}
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
                            setFilterConfiguration(
                                activeFilterId,
                                input.macroName,
                                { showLootbeam: e.target.checked }
                            )
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
                    setFilterConfiguration(activeFilterId, input.macroName, {
                        lootbeamColor: color,
                    })
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
                    onChange={(e) =>
                        setFilterConfiguration(
                            activeFilterId,
                            input.macroName,
                            {
                                showValue: e.target.checked,
                            }
                        )
                    }
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
                    onChange={(e) =>
                        setFilterConfiguration(
                            activeFilterId,
                            input.macroName,
                            {
                                showDespawn: e.target.checked,
                            }
                        )
                    }
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
                    onChange={(e) =>
                        setFilterConfiguration(
                            activeFilterId,
                            input.macroName,
                            {
                                notify: e.target.checked,
                            }
                        )
                    }
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
                    onChange={(e) =>
                        setFilterConfiguration(
                            activeFilterId,
                            input.macroName,
                            {
                                hideOverlay: e.target.checked,
                            }
                        )
                    }
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
                        onChange={(e) =>
                            setFilterConfiguration(
                                activeFilterId,
                                input.macroName,
                                { highlightTile: e.target.checked }
                            )
                        }
                    />
                }
            />
            <ColorPickerInput
                color={
                    styleConfig.tileStrokeColor ??
                    input.default?.tileStrokeColor
                }
                onChange={(color?: ArgbHexColor) =>
                    setFilterConfiguration(activeFilterId, input.macroName, {
                        tileStrokeColor: color,
                    })
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
                    setFilterConfiguration(activeFilterId, input.macroName, {
                        tileFillColor: color,
                    })
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
            value={styleConfig?.sound ?? input.default?.sound}
            onChange={(e) =>
                setFilterConfiguration(activeFilterId, input.macroName, {
                    sound: e.target.value,
                })
            }
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
                    <ItemLabelPreview
                        module={module}
                        input={input}
                        itemName={input.label}
                    />
                    <ItemMenuPreview
                        module={module}
                        input={input}
                        itemName={input.label}
                    />
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
