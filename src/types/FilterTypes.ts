import { ArgbHexColor } from "./hexcolor";
import { ItemGroupMapping } from "./ItemGroupMapping";

export type FilterConfig = {
  date: Date;
  lootGroups: LootGroup[];
  itemGroupMappings: ItemGroupMapping[];
  includePreamble: boolean;
};

export type DisplayConfig = {
  foregroundColor: ArgbHexColor;
  backgroundColor: ArgbHexColor;
  borderColor: ArgbHexColor;
  beam: boolean;
};

export type TargetConfig = {
  valueThreshold: number;
  // TODO other things, col log
};

export type LootGroup = {
  name: string;
  items?: ItemConfig[];
} & DisplayConfig &
  TargetConfig;

export type ItemConfig = {
  name: string;
  matcher?: string;
} & DisplayConfig &
  TargetConfig;
