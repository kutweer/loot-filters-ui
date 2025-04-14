import { parse as parseYaml } from 'yaml'
import { Module as FilterSpecModule } from './FilterTypesSpec'
import { Module, ModuleType } from './UiTypesSpec'

export const parseModule = (
    moduleId: string,
    lines: string[],
    start: number,
    end: number
): ModuleType => {
    // start 1 further to remove the /*@ define stuff
    const wholeComment = lines.slice(start + 1, end).join('\n')
    console.log('wholeComment\n', wholeComment)
    const declarationContent = wholeComment.substring(
        0,
        wholeComment.indexOf('*/')
    )
    const module = parseYaml(declarationContent!!)

    return Module.parse({ ...FilterSpecModule.parse(module), id: moduleId })
}
