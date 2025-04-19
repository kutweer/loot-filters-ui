import { parse as parseYaml } from 'yaml'
import { ModuleSpec as FilterSpecModule } from './FilterTypesSpec'
import { Module, ModuleSpec } from './UiTypesSpec'

export const parseModule = (moduleId: string, comment: string): Module => {
    const declarationContent = comment.substring(
        comment.indexOf('\n'), // chop the structured declaration
        comment.indexOf('*/')
    )
    const module = parseYaml(declarationContent)
    return ModuleSpec.parse({
        ...FilterSpecModule.parse(module),
        id: moduleId,
        rs2f: '',
    })
}
