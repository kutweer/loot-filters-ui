import { FilterConfig, LootGroup } from "../types/FilterTypes";
import {
  BLACK,
  BURGUNDY,
  CARAMEL,
  GOLD,
  GREEN,
  KHAKI,
  LIGHT_BROWN,
  NO_COLOR,
  RED,
  WHITE,
} from "../types/hexcolor";
import { ItemGroupMapping } from "../types/ItemGroupMapping";

const DEFAULT_LOOT_GROUPS: LootGroup[] = [
  {
    name: "S_TIER",
    foregroundColor: RED,
    borderColor: RED,
    backgroundColor: NO_COLOR,
    beam: true,
    valueThreshold: 100_000_000,
  },
  {
    name: "A_TIER",
    foregroundColor: WHITE,
    borderColor: WHITE,
    backgroundColor: NO_COLOR,
    beam: true,
    valueThreshold: 10_000_000,
  },
  {
    name: "B_TIER",
    foregroundColor: BLACK,
    borderColor: BLACK,
    backgroundColor: NO_COLOR,
    beam: false,
    valueThreshold: 1_000_000,
  },
  {
    name: "C_TIER",
    foregroundColor: CARAMEL,
    borderColor: CARAMEL,
    backgroundColor: NO_COLOR,
    beam: false,
    valueThreshold: 500_000,
  },
  {
    name: "D_TIER",
    foregroundColor: GOLD,
    borderColor: GOLD,
    backgroundColor: NO_COLOR,
    beam: false,
    valueThreshold: 100_000,
  },
  {
    name: "E_TIER",
    foregroundColor: KHAKI,
    borderColor: KHAKI,
    backgroundColor: NO_COLOR,
    beam: false,
    valueThreshold: 20_000,
  },
  {
    name: "HERB_GROUP",
    foregroundColor: GREEN,
    borderColor: GREEN,
    backgroundColor: NO_COLOR,
    beam: false,
    valueThreshold: 0,
  },
];

// Item lists by tier
const S_TIER_UNIQUES = [
  "*champion scroll",
  "Infernal Cape",
  "Fire Cape",
  "Dizana's Quiver*",
  "*Max Cape",
  "Unsired",
  "Ancient blood ornament kit",
  "Ultor vestige",
  "Executioner's axe head",
  "Venator vestige",
  "Leviathan's lure",
  "Bellator vestige",
  "Siren's staff",
  "Magus vestige",
  "Eye of the duke",
  "*mutagen",
  "Slepey Tablet",
];

const A_TIER_UNIQUES = [
  "Brimstone key",
  "Jar of*",
  "Noxious pommel",
  "Noxious point",
  "*half of key (moon key)",
];

const A_TIER_VALUES = ["Hill giant club"];

const B_TIER_UNIQUES = [
  "Dark totem",
  "Mossy key",
  "Giant key",
  "Ecumenical key",
  "Abyssal head",
  "Araxyte head",
  "Alchemical hydra heads",
  "Kbd heads",
  "Kq head*",
  "Dark claw",
  "Bludgeon claw",
  "Bludgeon spine",
  "Bludgeon axon",
  "Hydra's eye",
  "Hydra's fang",
  "Hydra's heart",
  "Strangled tablet",
  "Scarred tablet",
  "Sirenic tablet",
  "Frozen tablet",
  "Scurrius' spine",
  "Vorkath's head",
];

const C_TIER_UNIQUES = [
  "Dark totem top",
  "Dark totem base",
  "Dark totem middle",
  "Long bone",
  "Curved bone",
  "Looting bag",
  "Unidentified small fossil",
  "Unidentified medium fossil",
  "Unidentified large fossil",
  "Unidentified rare fossil",
  "Key master teleport",
  "Chromium ingot",
  "Blood quartz",
  "Smoke quartz",
  "Shadow quartz",
  "Ice quartz",
  "Pendant of ates*",
  "Frozen cache",
  "Ancient icon",
  "Charged Ice",
  "Parasitic egg",
];

const D_TIER_VALUES = [
  "Dragon bones",
  "Dagannoth bones",
  "Frozen tear",
  "Zulrah's scales",
  "Sunfire splinters",
  "Ancient essence",
  "Granite dust",
  "Crystal shard",
];

const E_TIER_VALUES = [
  "Archery ticket",
  "Mole claw",
  "Mole skin",
  "Trading sticks",
  "Shantay pass",
  "Ship ticket",
  "Abyssal pearls",
  "Anima-infused bark",
  "Agility arena ticket",
  "Barronite shards",
  "Blood money",
  "Brimhaven voucher",
  "Castle wars ticket",
  "Ecto-token",
  "Frog token",
  "Golden nugget",
  "Glistening tear",
  "Hallowed mark",
  "Intelligence",
  "Mark of grace",
  "Mermaid's tear",
  "Minnow",
  "Molch pearl",
  "Nuggets",
  "Paramaya ticket",
  "Rare creature parts",
  "Reward token credits",
  "Stardust",
  "Tokkul",
  "Termites",
  "Unidentified minerals",
  "Warrior guild token",
  "Blessed bone shards",
  "Sun-kissed bones",
  "Ecumenical key shard",
];

// Helper functions to create mappings
const createUniqueMappings = (tier: string, items: string[]) =>
  items.map((itemExpr) => ({
    groupName: tier,
    itemExpr,
    isUnique: true,
  }));

const createValueMappings = (tier: string, items: string[]) =>
  items.map((itemExpr) => ({
    groupName: tier,
    itemExpr,
    isUnique: false,
  }));

const DEFAULT_ITEM_GROUP_MAPPINGS: ItemGroupMapping[] = [
  ...createUniqueMappings("S_TIER", S_TIER_UNIQUES),
  ...createUniqueMappings("A_TIER", A_TIER_UNIQUES),
  ...createValueMappings("A_TIER", A_TIER_VALUES),
  ...createUniqueMappings("B_TIER", B_TIER_UNIQUES),
  ...createUniqueMappings("C_TIER", C_TIER_UNIQUES),
  ...createValueMappings("D_TIER", D_TIER_VALUES),
  ...createValueMappings("E_TIER", E_TIER_VALUES),
  // Herb Group
  {
    groupName: "HERB_GROUP",
    itemExpr: "Guam Leaf",
    isUnique: false,
  },
];

export const DEFAULT_CONFIG: FilterConfig = {
  itemGroupMappings: DEFAULT_ITEM_GROUP_MAPPINGS,
  lootGroups: DEFAULT_LOOT_GROUPS,
  date: new Date(),
  includePreamble: false,
};
