import { z } from 'zod'

export const ModuleSpec = z.object({
    name: z.string().nonempty(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    enabled: z.boolean().optional().default(true),
    hidden: z.boolean().optional().default(false),
})

export type Module = z.infer<typeof ModuleSpec>

export const InputSpec = z
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

export type Input = z.infer<typeof InputSpec>
