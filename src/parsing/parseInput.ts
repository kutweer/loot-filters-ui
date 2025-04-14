import { parse as parseYaml } from 'yaml'
import { InputSpec as FilterSpecInput } from './FilterTypesSpec'
import {
    BooleanInputSpec,
    EnumListInputSpec,
    Input,
    InputSpec,
    NumberInputSpec,
    StringListInputSpec,
    StyleInputSpec,
    TextInputSpec,
} from './UiTypesSpec'
import { parseDefine, Rs2fDefine } from './rs2fParser'

export const parseInput = (
    moduleId: string,
    lines: string[],
    start: number,
    end: number
): { moduleId: string; input: Input } => {
    // start 1 further to remove the /*@ define stuff
    const wholeComment = lines.slice(start + 1, end).join('\n')
    const declarationContent = wholeComment.substring(
        0,
        wholeComment.indexOf('*/')
    )

    // Macro for input MUST be the next line after the input declaration
    const inputDefault: Rs2fDefine = parseDefine(lines[end], end)
    console.log('inputDefault', inputDefault)
    const baseInput = {
        // ensure base input is correct - it should not have a default field - we define that in the macro only
        // This throws if the core input fields are incorrect
        ...FilterSpecInput.parse(parseYaml(declarationContent)),
        macroName: inputDefault.name,
        default: inputDefault.type === 'null' ? undefined : inputDefault.value,
    }
    console.log('baseInput input', baseInput)
    const input = InputSpec.parse(baseInput)
    console.log('input', input)

    // validate the input with a default field; to check that the default field is correct
    switch (input.type as unknown as string) {
        case 'boolean':
            return { moduleId: moduleId, input: BooleanInputSpec.parse(input) }
        case 'number':
            return { moduleId: moduleId, input: NumberInputSpec.parse(input) }
        case 'stringlist':
            return { moduleId: moduleId, input: StringListInputSpec.parse(input) }
        case 'enumlist':
            return { moduleId: moduleId, input: EnumListInputSpec.parse(input) }
        case 'style':
            return { moduleId: moduleId, input: StyleInputSpec.parse(input) }
        case 'text':
            return { moduleId: moduleId, input: TextInputSpec.parse(input) }
        default:
            throw new Error(`Invalid input type: ${input.type}`)
    }
}
