// Needs to match the display config in the plugin. All display features should be supported.

import { ArgbHexColor } from "../utils/Color";

// https://github.com/riktenx/loot-filters/blob/main/src/main/java/com/lootfilters/DisplayConfig.java
type DisplayConfig = {
  textColor: ArgbHexColor;
  backgroundColor: ArgbHexColor;
  borderColor: ArgbHexColor;
  hidden: boolean;
  showLootbeam: boolean;
  showValue: boolean;
  showDespawn: boolean;
  notify: boolean;
  textAccent: TextAccent;
  textAccentColor: ArgbHexColor;
  lootbeamColor: ArgbHexColor;
  fontType: FontType;
  menuTextColor: ArgbHexColor;
  hideOverlay: boolean;
  highlightTile: boolean;
  tileStrokeColor: ArgbHexColor;
  tileFillColor: ArgbHexColor;
};

enum TextAccent {
  USE_FILTER = "use filter",
  SHADOW = "shadow",
  OUTLINE = "outline",
  NONE = "none",
}

enum FontType {
  USE_FILTER = "use filter",
  NORMAL = "normal",
  LARGER = "larger",
}

type LootFilter = {
  name: string;
  displayConfigBase: Partial<DisplayConfig> & {
    textColor: ArgbHexColor;
    fontType: FontType;
  };
  groups: LootGroup[];
};

type LootGroup = {
  name: string;
  description?: string;
  displayConfigOverrides: Partial<DisplayConfig>;
  targets: LootTarget[];
};

type LootTarget = {
  name: string;
  description?: string;
  displayConfigOverrides: Partial<DisplayConfig>;
  examples?: string[];
  rules: LootRule[];
};

export type LootRuleType = (typeof lootRuleTypes)[number];
export const lootRuleTypes = [
  "name",
  "id",
  "value",
  "noted",
  "stackable",
  "tradeable",
  "boolean",
];

type LootRule =
  | ItemNameRule
  | ItemIdRule
  | ItemValueRule
  | ItemNotedRule
  | ItemStackableRule
  | ItemTradeableRule
  | BooleanRule;

type BooleanRule = {
  type: "boolean";
  operator: "not" | "and" | "or";
  rules: LootRule[];
};

type ItemNameRule = {
  type: "name";
  pattern: string;
};

type ItemIdRule = {
  type: "id";
  id: number;
};

type ItemValueRule = {
  type: "value";
  operator: ">" | "<" | "=" | ">=" | "<=";
  value: number;
};

type ItemNotedRule = {
  type: "noted";
  noted: boolean;
};

type ItemStackableRule = {
  type: "stackable";
  stackable: boolean;
};

type ItemTradeableRule = {
  type: "tradeable";
  tradeable: boolean;
};

export { FontType, TextAccent };

export type {
  BooleanRule,
  DisplayConfig,
  ItemIdRule,
  ItemNameRule,
  ItemNotedRule,
  ItemStackableRule,
  ItemTradeableRule,
  ItemValueRule,
  LootFilter,
  LootGroup,
  LootRule,
  LootTarget,
};
