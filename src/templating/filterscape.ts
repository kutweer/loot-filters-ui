import { extendOwn } from "underscore";
import { renderLootGroup } from "./lootgroup";
import { preamble } from "./preamble";

const meta = (date: Date) => {
    return `meta {
    name = "loot-filters/filterscape";
    description = "Reference implementation of a loot filter, covering all major rares/uniques. Generated on ${date.toString()}.";
}`.trim();
}

export type FilterConfig = {
    date: Date,
    lootGroups: LootGroup[],
    includePreamble: boolean
}

export type HexColor = `#${string}` | 'RED' | 'WHITE' | 'LIGHT_BROWN' | 'BLACK' | null


export type LootGroup = {
    name: string
    foregroundColor: HexColor,
    backgroundColor: HexColor, 
    borderColor: HexColor,
    beam: boolean
    valueThreshold: Number
}

export const DEFAULT_CONFIG : FilterConfig = {
    lootGroups: [
        {
            name: "S_TIER",
            foregroundColor: 'RED',
            borderColor: 'RED',
            backgroundColor: null,
            beam: true,
            valueThreshold: 100_000_000
        },
        {
            name: "S_TIER_UNIQUE",
            foregroundColor: 'RED',
            backgroundColor: 'WHITE',
            borderColor: 'RED',
            beam: true,
            valueThreshold: 100_000_000
        },
        {
            name: "A_TIER",
            foregroundColor: 'WHITE',
            borderColor: 'WHITE',
            backgroundColor: null,
            beam: true,
            valueThreshold: 10_000_000
        },
        {
            name: "A_TIER_UNIQUE",
            foregroundColor: 'WHITE',
            backgroundColor: 'LIGHT_BROWN',
            borderColor: 'WHITE',
            beam: true,
            valueThreshold: 10_000_000
        },
        {
            name: "B_TIER",
            foregroundColor: 'BLACK',
            borderColor: 'BLACK',
            backgroundColor: null,
            beam: false,
            valueThreshold: 1_000_000
        },
        {
            name: "B_TIER",
            foregroundColor: 'BLACK',
            borderColor: 'BLACK',
            backgroundColor: 'LIGHT_BROWN',
            beam: true,
            valueThreshold: 1_000_000
        }
    ],
    date: new Date(),
    includePreamble: false
  }

export const renderFilter = (filterConfig: FilterConfig): string => {
    return [
        "// META",
        meta(filterConfig.date),
         "// PREAMBLE",
        filterConfig.includePreamble ? preamble() : "// Preamble Excluded"  ,
        "// LOOT GROUPS",
        ...filterConfig.lootGroups.map(renderLootGroup),
    ].join('\n\n')
}
