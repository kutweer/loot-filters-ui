import { StyleInput } from '../../types/InputsSpec'

export type StyleConfig = Partial<StyleInput['default']>
export type StyleConfigKey = keyof StyleConfig & string
