import { LootGroup } from "./filterscape";

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
}: LootGroup): string => {
  const configName = checkUpperUnderscore(name)
    ? name
    : `LOOT_GROUP_${randCaps(4)}`;

  return `
// LOOT GROUP: ${name}
#define ${configName} { \
    COLOR_FG_BR_BG(${foregroundColor}, ${borderColor}, ${backgroundColor}); \
    textAccent = 1; \
    showLootBeam = ${beam ? "true" : "false"}; \
    fontType = 2; \
}
// For manually defined value tiers of items
#define VALUE_${configName} (_name) if (name:_name) ${configName} 
// For automatically defined value tiers of items
#define VALUE_THRESHOLD_${configName} ${valueThreshold}
if (value:>VALUE_THRESHOLD_${configName}) ${configName}
// Different settings for unique items
#define UNIQUE_${configName} (_name) if (name:_name) { \
    COLOR_FG_BR_BG(${foregroundColor}, ${borderColor}, ${backgroundColor}); \
    textAccent = 3; \
    showLootBeam = ${beam ? "true" : "false"}; \
    fontType = 2; \
}
// END LOOT GROUP: ${name}`;
};
