import { ArgbHexColor } from "./hexcolor";
import { ItemGroupMapping } from "./ItemGroupMapping";

export type FilterConfig = {
  date: Date;
  lootGroups: LootGroup[];
  itemGroupMappings: ItemGroupMapping[];
  includePreamble: boolean;
};

export type LootGroup = {
  name: string;
  foregroundColor: ArgbHexColor;
  backgroundColor: ArgbHexColor;
  borderColor: ArgbHexColor;
  beam: boolean;
  valueThreshold: number;
  uniqueOverrides?: Partial<Omit<LootGroup, "valueThreshold" | "name">>;
};
