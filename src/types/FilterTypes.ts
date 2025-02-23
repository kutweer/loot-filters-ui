import { ArgbHexColor } from "./hexcolor";
import { ItemGroupMapping } from "./ItemGroupMapping";

export type FilterConfig = {
  date: Date;
  lootGroups: LootGroup[];
  includePreamble: boolean;
};

export type DisplayConfig = {
  foregroundColor: ArgbHexColor;
  backgroundColor: ArgbHexColor;
  borderColor: ArgbHexColor;
  beam: boolean;
};

export type TargetingRules = {
  valueThreshold?: number;
  // TODO other things, col log
};

export type LootGroup = {
  name: string;
  items?: ItemConfig[];
} & DisplayConfig &
  TargetingRules;

export type ItemConfig = {
  name: string;
  matcher?: string;
} & Partial<DisplayConfig> &
  TargetingRules;
