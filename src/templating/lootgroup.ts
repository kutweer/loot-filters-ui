import { LootGroup } from "./filterscape";

const randCaps = (length: number): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const renderLootGroup = ({
  name,
  foregroundColor,
  backgroundColor,
  borderColor,
  beam,
}: LootGroup): string => {
  const configName = `LOOT_GROUP_${randCaps(4)}`;

  return `
// LOOT GROUP: ${name}
#define ${configName} { \
    COLOR_FG_BR_BG(${foregroundColor}, ${borderColor}, ${backgroundColor}); \
    textAccent = 1; \
    showLootBeam = ${beam ? "true" : "false"}; \
    fontType = 2; \
}

// For manually defined value tiers of items
#define VALUE_S_TIER (_name) if (name:_name) ${configName} 

// For automatically defined value tiers of items
if (value:>VALUE_TIER_S) S_TIER


#define VALUE_${configName} (_name ) if (name:_name) { \
    COLOR_FG_BR_BG(${foregroundColor}, ${borderColor}, ${backgroundColor}); \
    textAccent = 1; \
    showLootBeam = ${beam ? "true" : "false"}; \
    fontType = 2; \
}

# define UNIQUE_${configName} (_name ) if (name:_name) { \
    COLOR_FG_BR_BG(${foregroundColor}, ${borderColor}, ${backgroundColor}); \
    textAccent = 3; \
    showLootBeam = ${beam ? "true" : "false"}; \
    fontType = 2; \
}`;
};
