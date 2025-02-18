import preamble from "../filterscape/preamble.rs2f";
import { FilterConfig, LootGroup } from "../types/FilterTypes";
import { ItemGroupMapping } from "../types/ItemGroupMapping";
import useSiteConfig from "../utils/devmode";

const meta = (date: Date) => {
  return `meta {
    name = "loot-filters/filterscape";
    description = "Reference implementation of a loot filter, covering all major rares/uniques. Generated on ${date.toString()}.";
}`.trim();
};

const randCaps = (length: number): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const checkUpperUnderscore = (str: string): boolean => {
  return /^[A-Z_]+$/.test(str);
};

export const renderLootGroup = ({
  name,
  foregroundColor,
  backgroundColor,
  borderColor,
  beam,
  valueThreshold,
  uniqueOverrides,
  items,
}: LootGroup & { items: ItemGroupMapping[] }): string => {
  const configName = checkUpperUnderscore(name)
    ? name
    : `LOOT_GROUP_${randCaps(4)}`;

  const sections = [];
  const baseDef = `
// LOOT GROUP: ${name}
#define ${configName} { \
    COLOR_FG_BR_BG(${foregroundColor}, ${borderColor}, ${backgroundColor}); \
    textAccent = 1; \
    showLootBeam = ${beam ? "true" : "false"}; \
    fontType = 2; \
}`;
  sections.push(baseDef);

  if (valueThreshold > 0) {
    const valueDef = `// For manually defined value tiers of items
#define VALUE_${configName} (_name) if (name:_name) ${configName}
// For automatically defined value tiers of items
#define VALUE_THRESHOLD_${configName} ${valueThreshold}
if (value:> VALUE_THRESHOLD_${configName}) ${configName}`;
    sections.push(valueDef);
  }

  if (uniqueOverrides != null) {
    const uniqueDef = `// Different settings for unique items
#define UNIQUE_${configName} (_name) if (name:_name) { \
  COLOR_FG_BR_BG(${foregroundColor}, ${borderColor}, ${backgroundColor}); \
  textAccent = 3; \
  showLootBeam = ${beam ? "true" : "false"}; \
  fontType = 2; \
}`;
    sections.push(uniqueDef);
  }
  const itemDefs = items.map((item) => {
    if (item.isUnique) {
      return `UNIQUE_${configName} ("${item.itemExpr}")`;
    } else {
      return `VALUE_${configName} ("${item.itemExpr}")`;
    }
  });
  sections.push(itemDefs.join("\n"));

  const endDef = `// END LOOT GROUP: ${name}`;
  sections.push(endDef);

  return sections.join("\n\n");
};

export const renderFilter = (filterConfig: FilterConfig): string => {
  const [siteConfig, _] = useSiteConfig();
  return [
    "// META",
    meta(filterConfig.date),
    "// PREAMBLE",
    siteConfig.devMode ? "// Preamble Excluded" : preamble,
    "// LOOT GROUPS",
    ...filterConfig.lootGroups.map((lg) => (
      {
        ...lg,
        items: filterConfig.itemGroupMappings.filter((m) => m.groupName === lg.name)
      }
    )).map(renderLootGroup),
  ].join("\n\n");
};
