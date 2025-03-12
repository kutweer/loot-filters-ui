import ExpandMore from '@mui/icons-material/ExpandMore'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Divider,
    Grid2,
    Paper,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material'
import React, { useMemo, useState } from 'react'
import { groupBy } from 'underscore'
import { useUiStore } from '../../store/store'
import { colors } from '../../styles/MuiTheme'

import {
    BooleanInput,
    EnumListInput,
    FilterType,
    IncludeExcludeListInput,
    Input,
    NumberInput,
    StringListInput,
    StyleInput,
} from '../../types/InputsSpec'
import { FilterId, UiFilterModule } from '../../types/ModularFilterSpec'

import { BooleanInputComponent } from '../inputs/BooleanInputComponent'
import { DisplayConfigurationInput } from '../inputs/DisplayConfigurationInput'
import { EnumInputComponent } from '../inputs/EnumInputComponent'
import { IncludeExcludeListInputComponent } from '../inputs/IncludeExcludeListInputComponent'
import { NumberInputComponent } from '../inputs/NumberInputComponent'
import { StringListInputComponent } from '../inputs/StringListInputComponent'
import { StyleConfig } from '../inputs/StyleInputHelpers'
import { ItemLabelPreview } from '../Previews'

const InputComponent: React.FC<{
    activeFilterId: FilterId
    module: UiFilterModule
    input: Input
}> = ({ activeFilterId, module, input }) => {
    switch (input.type as FilterType) {
        case 'number':
            const numberInput = input as NumberInput
            return (
                <NumberInputComponent
                    activeFilterId={activeFilterId}
                    input={numberInput}
                    module={module}
                />
            )
        case 'boolean':
            return (
                <BooleanInputComponent
                    activeFilterId={activeFilterId}
                    module={module}
                    input={input as BooleanInput}
                />
            )
        case 'enumlist':
            const enumListInput = input as EnumListInput
            return (
                <EnumInputComponent
                    activeFilterId={activeFilterId}
                    module={module}
                    input={enumListInput}
                />
            )
        case 'stringlist':
            return (
                <StringListInputComponent
                    activeFilterId={activeFilterId}
                    module={module}
                    input={input as StringListInput}
                />
            )
        case 'style':
            return (
                <DisplayConfigurationInput
                    module={module}
                    input={input as StyleInput}
                />
            )
        case 'includeExcludeList':
            return (
                <IncludeExcludeListInputComponent
                    activeFilterId={activeFilterId}
                    module={module}
                    input={input as IncludeExcludeListInput}
                />
            )
        default:
            return (
                <Typography variant="h6" color="secondary">
                    Unsupported input type:{' '}
                    <span style={{ color: colors.rsOrange }}>{input.type}</span>
                </Typography>
            )
    }
}

const sizeOf = (input: Input) => {
    switch (input.type) {
        case 'number':
            return 4
        case 'boolean':
            return 2
        case 'style':
            return 16
        case 'includeExcludeList':
            return 12
        default:
            return 4
    }
}

const FirstCoupleLabels: React.FC<{
    module: UiFilterModule
}> = ({ module }) => {
    const styleInputs: StyleInput[] = module.inputs.filter(
        (input) => input.type === 'style'
    ) as StyleInput[]

    const activeFilterId = useUiStore(
        (state) =>
            Object.keys(state.importedModularFilters).find(
                (id) => state.importedModularFilters[id].active
            )!!
    )
    const configForModule = useUiStore(
        (state) => state.filterConfigurations?.[activeFilterId]?.[module.id]
    )

    const visibleStyleInputs = styleInputs.filter((input) => {
        const config = configForModule?.[
            input.macroName
        ] as Partial<StyleConfig>
        return !(config?.hideOverlay ?? input.default?.hideOverlay ?? false)
    })

    return (
        <Stack direction="row" spacing={2}>
            {visibleStyleInputs.slice(0, 4).map((input) => {
                const macroName = (input as StyleInput).macroName
                return (
                    <ItemLabelPreview
                        key={macroName}
                        itemName={input.label}
                        input={input}
                        module={module}
                    />
                )
            })}
        </Stack>
    )
}

const ModuleSection: React.FC<{
    activeFilterId: FilterId
    expanded: boolean
    setExpanded: (expanded: boolean) => void
    module: UiFilterModule
}> = ({ activeFilterId, expanded, setExpanded, module }) => {
    const { siteConfig } = useUiStore()
    const [showJson, setShowJson] = useState<'json' | 'configJson' | 'none'>(
        'none'
    )
    const activeConfig = useUiStore(
        (state) => state.filterConfigurations[activeFilterId]
    )

    const setActiveConfig = useUiStore((state) => state.setFilterConfiguration)

    let json: string | null = null
    let configJson: string | null = null

    if (siteConfig.devMode) {
        json = JSON.stringify(module, null, 2)
        configJson = JSON.stringify(activeConfig, null, 2)
    }

    const defaultGroupId = crypto.randomUUID()

    const groupedInputs = groupBy(
        module.inputs.map((input) => ({
            ...input,
            group: input.group ?? defaultGroupId,
        })),
        'group'
    )

    const moduleEnabledDefaultValue = module?.enabled ?? true
    const configuredEnableValue = activeConfig?.[module.id]?.enabled
    const enabled = configuredEnableValue ?? moduleEnabledDefaultValue

    if (!enabled) {
        return (
            <Paper sx={{ pl: 2, pr: 2, pt: 1, pb: 1 }}>
                <Grid2 container spacing={2}>
                    <Grid2 size={10}>
                        <Typography variant="h4" color="primary">
                            {module.name} is disabled
                        </Typography>
                    </Grid2>
                    <Button
                        sx={{ marginLeft: 'auto' }}
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setActiveConfig(
                                activeFilterId,
                                module.id,
                                'enabled',
                                !enabled
                            )
                        }}
                    >
                        {module.enabled ? 'Disable' : 'Enable Module'}
                    </Button>
                </Grid2>
            </Paper>
        )
    }

    return (
        <Accordion
            slotProps={{ transition: { unmountOnExit: true } }}
            expanded={expanded && enabled}
            disabled={!enabled}
            onChange={() => setExpanded(!expanded)}
            sx={{
                '&::before': {
                    backgroundColor: colors.rsDarkBrown,
                },
            }}
        >
            <AccordionSummary
                component="div"
                expandIcon={<ExpandMore />}
                sx={{
                    '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                    },
                }}
            >
                <Typography variant="h4" color="primary" sx={{ mr: 2 }}>
                    {module.name}{' '}
                    {module?.description ? (
                        <Typography
                            variant="h6"
                            component="span"
                            color="secondary"
                            sx={{
                                ml: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '400px',
                                display: 'inline-block',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {module.subtitle}
                        </Typography>
                    ) : null}
                </Typography>
                <Stack direction="row" spacing={2}>
                    <FirstCoupleLabels module={module} />
                </Stack>
                <Box sx={{ marginLeft: 'auto' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setActiveConfig(
                                activeFilterId,
                                module.id,
                                'enabled',
                                !enabled
                            )
                        }}
                    >
                        {enabled ? 'Disable Module' : 'Enable'}
                    </Button>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Stack spacing={2} direction="column">
                    <Typography
                        variant="h6"
                        component="span"
                        color={colors.rsLightestBrown}
                        sx={{
                            ml: 1,
                            display: 'inline-block',
                        }}
                    >
                        {module.description}
                    </Typography>
                    {siteConfig.devMode ? (
                        <Box display="flex" justifyContent="flex-end">
                            <ToggleButtonGroup
                                value={showJson}
                                onChange={(event, value) => setShowJson(value)}
                                exclusive
                            >
                                <ToggleButton value="json">
                                    Show Module JSON
                                </ToggleButton>
                                <ToggleButton value="configJson">
                                    Show Config JSON
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    ) : null}
                    {showJson !== 'none' && !!showJson ? (
                        <Box
                            sx={{
                                backgroundColor: 'background.paper',
                                p: 2,
                                borderRadius: 1,
                            }}
                        >
                            <pre
                                style={{
                                    margin: 0,
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                }}
                            >
                                {showJson === 'json'
                                    ? json
                                    : showJson === 'configJson'
                                      ? configJson
                                      : null}
                            </pre>
                        </Box>
                    ) : null}
                    {Object.entries(groupedInputs).map(
                        ([group, inputs], index) => {
                            return (
                                <Grid2 key={index} container spacing={2}>
                                    <Grid2 size={12}>
                                        <Divider>
                                            {group !== defaultGroupId ? (
                                                <Typography
                                                    variant="h6"
                                                    color="primary"
                                                >
                                                    {group}
                                                </Typography>
                                            ) : null}
                                        </Divider>
                                    </Grid2>
                                    {inputs
                                        .sort(
                                            (a: Input, b: Input) =>
                                                sizeOf(a) - sizeOf(b)
                                        )
                                        .map((input, index) => {
                                            return (
                                                <Grid2
                                                    key={index}
                                                    size={sizeOf(input)}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        color="primary"
                                                    >
                                                        {input.label}
                                                    </Typography>
                                                    <InputComponent
                                                        activeFilterId={
                                                            activeFilterId
                                                        }
                                                        module={module}
                                                        input={input}
                                                    />
                                                </Grid2>
                                            )
                                        })}
                                </Grid2>
                            )
                        }
                    )}
                </Stack>
            </AccordionDetails>
        </Accordion>
    )
}

export const CustomizeTab: React.FC = () => {
    const { siteConfig } = useUiStore()
    const importedModularFilters = useUiStore(
        (state) => state.importedModularFilters
    )
    const [expandedModules, setExpandedModules] = useState<
        Record<string, boolean>
    >({})

    const activeFilter = useMemo(
        () =>
            Object.values(importedModularFilters).find(
                (filter) => filter.active
            ),
        [importedModularFilters]
    )

    const setAllExpanded = (expanded: boolean) => {
        if (!activeFilter) return
        const newExpandedModules: Record<string, boolean> = {}
        activeFilter.modules.forEach((module) => {
            newExpandedModules[module.name] = expanded
        })
        setExpandedModules(newExpandedModules)
    }

    React.useEffect(() => {
        const handleExpandAll = (event: CustomEvent) => {
            setAllExpanded(event.detail)
        }

        window.addEventListener('expandAll', handleExpandAll as EventListener)
        return () => {
            window.removeEventListener(
                'expandAll',
                handleExpandAll as EventListener
            )
        }
    }, [activeFilter])

    if (!activeFilter) {
        return (
            <Typography variant="h4" color="primary">
                No filter selected
            </Typography>
        )
    }

    return (
        <Stack spacing={2}>
            {activeFilter?.modules.map((module, index: number) => (
                <ModuleSection
                    key={index}
                    activeFilterId={activeFilter.id}
                    module={module}
                    expanded={
                        expandedModules[module.name] ??
                        (false || siteConfig.devMode)
                    }
                    setExpanded={(expanded) =>
                        setExpandedModules((prev) => ({
                            ...prev,
                            [module.name]: expanded,
                        }))
                    }
                />
            ))}
        </Stack>
    )
}
