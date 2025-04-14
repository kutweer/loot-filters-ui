import { z } from 'zod'
import {
    Input as FilterSpecInput,
    Module as FilterSpecModule,
} from './FilterTypesSpec'

export const Input = FilterSpecInput.extend({
    macroName: z.string().nonempty(),
    default: z.any().optional(),
}).catchall(z.any())

export type InputType = z.infer<typeof Input>

export const Module = FilterSpecModule.extend({
    id: z.string().nonempty(),
    inputs: z.array(Input).default([]),
})

export type ModuleType = z.infer<typeof Module>

// Concrete implementations for each input type
export const BooleanInput = Input.extend({
    type: z.literal('boolean'),
    default: z.boolean().optional(),
})

export const NumberInput = Input.extend({
    type: z.literal('number'),
    default: z.number().optional(),
})

export const StringListInput = Input.extend({
    type: z.literal('stringlist'),
    default: z.array(z.string()).optional(),
})

export const ListOption = z.object({
    label: z.string(),
    value: z.string(),
})

export type ListOptionType = z.infer<typeof ListOption>
export const EnumListInput = Input.extend({
    type: z.literal('enumlist'),
    default: z.array(z.string()).optional(),
    enum: z.array(ListOption.or(z.string())).min(1),
})

export const StyleInput = Input.extend({
    type: z.literal('style'),
    default: z
        .object({
            textColor: z.string().optional(),
            backgroundColor: z.string().optional(),
            borderColor: z.string().optional(),
            textAccent: z.number().optional(),
            textAccentColor: z.string().optional(),
            fontType: z.number().optional(),
            showLootbeam: z.boolean().optional(),
            lootbeamColor: z.string().optional(),
            showValue: z.boolean().optional(),
            showDespawn: z.boolean().optional(),
            notify: z.boolean().optional(),
            hideOverlay: z.boolean().optional(),
            highlightTile: z.boolean().optional(),
            menuTextColor: z.string().optional(),
            tileStrokeColor: z.string().optional(),
            tileFillColor: z.string().optional(),
            tileHighlightColor: z.string().optional(),
            sound: z.string().optional(),
        })
        .optional(),
})

export const TextInput = Input.extend({
    type: z.literal('text'),
    default: z.string(),
})

export type BooleanInputType = z.infer<typeof BooleanInput>
export type NumberInputType = z.infer<typeof NumberInput>
export type StringListInputType = z.infer<typeof StringListInput>
export type EnumListInputType = z.infer<typeof EnumListInput>
export type StyleInputType = z.infer<typeof StyleInput>
export type TextInputType = z.infer<typeof TextInput>

export const Filter = z.object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    description: z.string().optional(),
    rs2fHash: z.string(),
    active: z.boolean().default(false),
    importedOn: z.string().datetime().default(new Date().toISOString()),
    source: z.string().url().optional(),
    modules: z.array(Module).default([]),
    rs2f: z.string(),
})

export type FilterType = z.infer<typeof Filter>
