import { ArgbHexColor } from "./hexcolor";

export type FilterConfig = {
  name: string;
  lootGroups: LootGroup[];
  includePreamble: boolean;
  active: boolean;
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
