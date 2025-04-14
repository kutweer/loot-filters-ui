import { z } from 'zod'

export const Module = z.object({
    name: z.string().nonempty(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
})

export type ModuleType = z.infer<typeof Module>

export const Input = z
    .object({
        type: z.enum([
            'boolean',
            'number',
            'stringlist',
            'enumlist',
            'style',
            'text',
        ]),
        label: z.string().nonempty(),
        group: z.string().optional(),
        exampleItem: z.string().optional(),
    })
    .catchall(z.any())

export type InputType = z.infer<typeof Input>
