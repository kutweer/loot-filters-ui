import { z } from 'zod'
import {
    Input as FilterSpecInput,
    Module as FilterSpecModule,
} from './FilterTypesSpec'

export const Input = FilterSpecInput.extend({
    default: z.any().optional(),
})

export type InputType = z.infer<typeof Input>

export const Module = FilterSpecModule.extend({
    id: z.string().nonempty(),
    inputs: z.array(Input).default([]),
})

export type ModuleType = z.infer<typeof Module>
