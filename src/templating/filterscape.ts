import { BLACK, GREEN, HexColor, LIGHT_BROWN, RED, WHITE } from "./hexcolor";
import { renderLootGroup } from "./lootgroup";
import { preamble } from "./preamble";

const meta = (date: Date) => {
  return `meta {
    name = "loot-filters/filterscape";
    description = "Reference implementation of a loot filter, covering all major rares/uniques. Generated on ${date.toString()}.";
}`.trim();
};

export type FilterConfig = {
  date: Date;
  lootGroups: LootGroup[];
  includePreamble: boolean;
};

export type LootGroup = {
  name: string;
  foregroundColor: HexColor;
  backgroundColor: HexColor;
  borderColor: HexColor;
  beam: boolean;
  valueThreshold: number;
  uniqueOverrides?: Partial<Omit<LootGroup, "valueThreshold" | "name">>;
};

export const DEFAULT_CONFIG: FilterConfig = {
  lootGroups: [
    {
      name: "S_TIER",
      foregroundColor: RED,
      borderColor: RED,
      backgroundColor: "#00000000",
      beam: true,
      valueThreshold: 100_000_000,
      uniqueOverrides: {
        backgroundColor: WHITE,
      },
    },
    {
      name: "A_TIER",
      foregroundColor: WHITE,
      borderColor: WHITE,
      backgroundColor: "#00000000",
      beam: true,
      valueThreshold: 10_000_000,
      uniqueOverrides: {
        backgroundColor: LIGHT_BROWN,
      },
    },
    {
      name: "B_TIER",
      foregroundColor: BLACK,
      borderColor: BLACK,
      backgroundColor: "#00000000",
      beam: false,
      valueThreshold: 1_000_000,
      uniqueOverrides: {
        backgroundColor: LIGHT_BROWN,
        beam: true,
      },
    },
    {
      name: "HERB_TIER",
      foregroundColor: GREEN,
      borderColor: GREEN,
      backgroundColor: "#00000000",
      beam: false,
      valueThreshold: 10_000,
    },
  ],
  date: new Date(),
  includePreamble: false,
};

export const renderFilter = (filterConfig: FilterConfig): string => {
  return [
    "// META",
    meta(filterConfig.date),
    "// PREAMBLE",
    window.location.hostname !== "localhost"
      ? preamble()
      : "// Preamble Excluded",
    "// LOOT GROUPS",
    ...filterConfig.lootGroups.map(renderLootGroup),
  ].join("\n\n");
};
