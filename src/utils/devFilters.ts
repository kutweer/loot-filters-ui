import { FilterDefinition } from '../types/ModularFilterSpec'

const enableDisableModuleFilter: FilterDefinition = {
    name: '[Dev] Enable Disable Module Test',
    description: 'A descriptive description of the filter',
    modules: [
        {
            name: 'Enable Disable Module Test',
            moduleJson: {
                name: 'Enable Disable Module Test',
                subtitle: 'A good sized subtitle with a long description',
                description:
                    "A long description of the input, no longer. Longer than 400px so long it wraps around. Maybe longer. Excessively long so that we can test the limits of chrome. Nope that's not enough we need more.",

                enabled: false,
                inputs: [
                    {
                        type: 'boolean',
                        label: 'A simple input',
                        macroName: 'INPUT_TEST',
                        default: false,
                    },
                ],
            },
            moduleRs2fText: '#define INPUT_TEST',
        },
    ],
}

const listInputFilter: FilterDefinition = {
    name: '[Dev] List Input Filter',
    description: 'A filter that allows you to select a list of items',
    modules: [
        {
            name: 'List Input',
            moduleJson: {
                name: 'List Input',
                description: 'A list input with no default values',
                inputs: [
                    {
                        type: 'enumlist',
                        macroName: 'VAR_HERB_SHOW',
                        label: 'Herbs to always show regardless of value',
                        enum: [
                            { value: 'guam leaf', label: 'Guam Leaf' },
                            { value: 'marrentill', label: 'Marrentill' },
                            { value: 'tarromin', label: 'Tarromin' },
                            { value: 'harralander', label: 'Harralander' },
                            { value: 'ranarr weed', label: 'Ranarr Weed' },
                            { value: 'toadflax', label: 'Toadflax' },
                            { value: 'irit leaf', label: 'Irit Leaf' },
                            { value: 'avantoe', label: 'Avantoe' },
                            { value: 'kwuarm', label: 'Kwuarm' },
                            { value: 'huasca', label: 'Huasca' },
                            { value: 'snapdragon', label: 'Snapdragon' },
                            { value: 'cadantine', label: 'Cadantine' },
                            { value: 'lantadyme', label: 'Lantadyme' },
                            { value: 'dwarf weed', label: 'Dwarf Weed' },
                            { value: 'torstol', label: 'Torstol' },
                        ],
                        default: [],
                    },
                    {
                        type: 'stringlist',
                        group: 'addl-highlight',
                        label: 'ToA-specific item highlights',
                        macroName: 'VAR_TOA_HIGHLIGHT',
                        default: ['example-item'],
                    },
                    {
                        type: 'includeExcludeList',
                        macroName: {
                            includes: 'VAR_GENERAL_GRAARDOR_UNIQUES_SHOW',
                            excludes: 'VAR_GENERAL_GRAARDOR_UNIQUES_HIDE',
                        },
                        label: 'General Graardor uniques',
                        default: {
                            includes: [
                                'Bandos chestplate',
                                'Bandos tassets',
                                'Bandos boots',
                                'Bandos hilt',
                            ],
                            excludes: [],
                        },
                    },
                ],
            },
            moduleRs2fText: '#define STYLE_INPUT_TEST nop;',
        },
    ],
}

export const DEV_FILTERS = [
    {
        name: '[Dev] Style Input',
        url: 'https://raw.githubusercontent.com/Kaqemeex/loot-filters-ui/refs/heads/main/module-system-docs/site-testing-filters/single_style_filter.json',
    },
    {
        name: '[Dev] Number, Bool & Unsupported inputs',
        url: 'https://raw.githubusercontent.com/Kaqemeex/loot-filters-ui/refs/heads/main/module-system-docs/site-testing-filters/misc_filter.json',
    },
    {
        name: '[Dev] Invalid Filter',
        url: 'https://raw.githubusercontent.com/Kaqemeex/loot-filters-ui/refs/heads/main/module-system-docs/site-testing-filters/filter_with_invalid_input.json',
    },
    enableDisableModuleFilter,
    listInputFilter,
]
