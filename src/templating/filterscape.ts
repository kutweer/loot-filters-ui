import { preamble } from "./preamble";

const meta = (date: Date) => {
    return `meta {
    name = "loot-filters/filterscape";
    description = "Reference implementation of a loot filter, covering all major rares/uniques. Generated on ${date.toLocaleDateString()}.";
}`.trim();
}

export type FilterConfig = {
    date: Date,
    lootGroups: LootGroup[]
}

export type HexColor = `#${string}`

export type ValueTier = {
    name: string
    color: HexColor
}

export type LootGroup = {
    name: string
    foregroundColor: HexColor,
    backgroundColor: HexColor, 
    borderColor: HexColor,
    textColor: HexColor,

}

export const renderFilter = (date: Date, filterConfig: FilterConfig): string => {
    return [
        meta(date),
        preamble(),
    ].join('\n')
}
