import { z } from 'zod'

export const Module = z.object({
    name: z.string().nonempty(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
})

export type ModuleType = z.infer<typeof Module>

export const Input = z.object({
    type: z.enum([
        'boolean',
        'number',
        'stringlist',
        'enumlist',
        'style',
        'text',
    ]),
    label: z.string().nonempty(),
    macroName: z.string().nonempty(),
    group: z.string().optional(),
    exampleItem: z.string().optional(),
})

export type InputType = z.infer<typeof Input>

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

export const EnumListInput = Input.extend({
    type: z.literal('enumlist'),
    default: z.array(z.string()).optional(),
    enum: z.array(z.string()).min(1),
})

export const StyleInput = Input.extend({
    type: z.literal('style'),
    default: z.object({
        textColor: z.string().optional(),
        backgroundColor: z.string().optional(),
        borderColor: z.string().optional(),
        textAccent: z.string().optional(),
        textAccentColor: z.string().optional(),
        fontType: z.string().optional(),
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
    }),
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
