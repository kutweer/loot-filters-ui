import preamble from "../filterscape/preamble.rs2f";
import { FilterConfig, LootGroup } from "../types/FilterTypes";
import useSiteConfig from "../utils/devmode";

const meta = (date: Date, sha: string) => {
  return `meta {
    name = "kaqemeex/filterscape";
    description = "An all in one loot filter for OSRS. Generated on ${date.toString()} with git SHA ${sha}.";
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
  items,
}: LootGroup): string => {
  const configName = checkUpperUnderscore(name)
    ? name
    : `LOOT_GROUP_${randCaps(4)}`;

  const sections = [];
  const baseDef = `
// LOOT GROUP: ${name}
#define ${configName} { \
    COLOR_FG_BR_BG("${foregroundColor}", "${borderColor}", "${backgroundColor}") \
    textAccent = 1; \
    showLootBeam = ${beam ? "true" : "false"}; \
    fontType = 2; \
}`;
  sections.push(baseDef);

  if (valueThreshold || 0 > 0) {
    const valueDef = `// For manually defined value tiers of items
#define VALUE_${configName} (_name) if (name:_name) ${configName}
// For automatically defined value tiers of items
#define VALUE_THRESHOLD_${configName} ${valueThreshold}
if (value:>VALUE_THRESHOLD_${configName}) ${configName}`;
    sections.push(valueDef);
  }

  (items || []).forEach((item) => {
    const itemMatchText = item.matcher || item.name;
    sections.push(`VALUE_${configName} ("${itemMatchText}")`);
  });

  const endDef = `// END LOOT GROUP: ${name}`;
  sections.push(endDef);

  return sections.join("\n");
};

export const renderFilter = (
  filterConfig: FilterConfig,
  sha: string,
): string => {
  const [siteConfig, _] = useSiteConfig();
  return [
    "// META",
    meta(filterConfig.date, sha),
    "// PREAMBLE",
    siteConfig.devMode ? "// Preamble Excluded" : preamble,
    "// LOOT GROUPS",
    ...filterConfig.lootGroups
      .map((lg) => ({
        ...lg,
      }))
      .map(renderLootGroup),
  ].join("\n\n");
};
