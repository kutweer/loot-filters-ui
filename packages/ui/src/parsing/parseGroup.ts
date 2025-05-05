import { parse as parseYaml } from 'yaml'
import { Group, GroupSpec } from './FilterTypesSpec'

export const parseGroup = (comment: string): Group => {
    const declarationContent = comment.substring(
        comment.indexOf('\n'), // chop the structured declaration
        comment.indexOf('*/')
    )
    const group = parseYaml(declarationContent)
    return GroupSpec.parse(group)
}
