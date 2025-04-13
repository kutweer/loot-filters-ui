import { parse as parseYaml } from 'yaml'
import {
    BooleanInput,
    EnumListInput,
    Input as FilterSpecInput,
    NumberInput,
    StringListInput,
    StyleInput,
    TextInput,
} from './FilterTypesSpec'
import { Input, InputType } from './UiTypesSpec'
import { parseDefine, Rs2fDefine } from './rs2fParser'

export const parseInput = (
    moduleId: string,
    lines: string[],
    start: number,
    end: number
): { moduleId: string; input: InputType } => {
    // start 1 further to remove the /*@ define stuff
    const wholeComment = lines.slice(start + 1, end).join('\n')
    const declarationContent = wholeComment.substring(
        0,
        wholeComment.indexOf('*/')
    )

    // Macro for input MUST be the next line after the input declaration
    const inputDefault: Rs2fDefine = parseDefine(lines[end + 1])
    const input = Input.parse({
        // ensure base input is correct - it should not have a default field - we define that in the macro only
        // This throws if the core input fields are incorrect
        ...FilterSpecInput.parse(parseYaml(declarationContent)),
        default: inputDefault.type === 'null' ? undefined : inputDefault.value,
    })

    // validate the input with a default field; to check that the default field is correct
    switch (input.type as unknown as string) {
        case 'boolean':
            return { moduleId: moduleId, input: BooleanInput.parse(input) }
        case 'number':
            return { moduleId: moduleId, input: NumberInput.parse(input) }
        case 'stringlist':
            return { moduleId: moduleId, input: StringListInput.parse(input) }
        case 'enumlist':
            return { moduleId: moduleId, input: EnumListInput.parse(input) }
        case 'style':
            return { moduleId: moduleId, input: StyleInput.parse(input) }
        case 'text':
            return { moduleId: moduleId, input: TextInput.parse(input) }
        default:
            throw new Error(`Invalid input type: ${input.type}`)
    }
}
