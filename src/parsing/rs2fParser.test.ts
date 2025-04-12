import { parseDefine } from './rs2fParser'

describe('RS2F Parser', () => {
    it('should parse style defines', () => {
        const result = parseDefine(
            '#define VAR_STYLE textColor="#FFFFFFFF";\\n textAccentColor="#FF000000";\\n backgroundColor="#5074E2E6";\\n borderColor="#FF74E2E6";\\n menuTextColor="#FF74E2E6";'
        )
        expect(result).toEqual({
            name: 'VAR_STYLE',
            value: {
                textColor: '#FFFFFFFF',
                textAccentColor: '#FF000000',
                backgroundColor: '#5074E2E6',
                borderColor: '#FF74E2E6',
                menuTextColor: '#FF74E2E6',
            },
            type: 'style',
        })
    })

    it('should parse integer defines', () => {
        const result = parseDefine('#define VAR_INT 100')
        expect(result).toEqual({
            name: 'VAR_INT',
            value: 100,
            type: 'number',
        })
    })

    it('should parse string defines', () => {
        const result = parseDefine('#define VAR_STR "foo"')
        expect(result).toEqual({
            name: 'VAR_STR',
            value: 'foo',
            type: 'string',
        })
    })

    it('should parse string list defines', () => {
        const result = parseDefine('#define VAR_STR_LIST ["str", "str2"]')
        expect(result).toEqual({
            name: 'VAR_STR_LIST',
            value: ['str', 'str2'],
            type: 'stringlist',
        })
    })

    it('should parse integer list defines', () => {
        const result = parseDefine('#define VAR_INT_LIST [1, 2, 3]')
        expect(result).toEqual({
            name: 'VAR_INT_LIST',
            value: [1, 2, 3],
            type: 'numberlist',
        })
    })

    it('should parse boolean defines', () => {
        const trueResult = parseDefine('#define VAR_BOOL_TRUE true')
        expect(trueResult).toEqual({
            name: 'VAR_BOOL_TRUE',
            value: true,
            type: 'boolean',
        })

        const falseResult = parseDefine('#define VAR_BOOL_FALSE false')
        expect(falseResult).toEqual({
            name: 'VAR_BOOL_FALSE',
            value: false,
            type: 'boolean',
        })
    })

    it('should parse null defines', () => {
        const result = parseDefine('#define VAR_NULL')
        expect(result).toEqual({
            name: 'VAR_NULL',
            value: null,
            type: 'null',
        })
    })

    it('should throw error for invalid define expressions', () => {
        expect(() => parseDefine('invalid')).toThrow(
            'Invalid define expression: invalid'
        )
    })
})
