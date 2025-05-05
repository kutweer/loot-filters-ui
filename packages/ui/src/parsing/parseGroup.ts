import { parse as parseYaml } from 'yaml'
import { GroupSpec as FilterSpecGroup } from './FilterTypesSpec'
import { Group, GroupSpec } from './UiTypesSpec'

export const parseGroup = (groupId: string, comment: string): Group => {
    const declarationContent = comment.substring(
        comment.indexOf('\n'), // chop the structured declaration
        comment.indexOf('*/')
    )
    const group = parseYaml(declarationContent)
    return GroupSpec.parse({
        ...FilterSpecGroup.parse(group),
        id: groupId,
        rs2f: '',
    })
}
