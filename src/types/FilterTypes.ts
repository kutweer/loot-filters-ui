import { HexColor } from "./hexcolor";
import { ItemGroupMapping } from "./ItemGroupMapping";

export type FilterConfig = {
  date: Date;
  lootGroups: LootGroup[];
  itemGroupMappings: ItemGroupMapping[];
  includePreamble: boolean;
};

export type LootGroup = {
  name: string;
  foregroundColor: HexColor;
  backgroundColor: HexColor;
  borderColor: HexColor;
  beam: boolean;
  valueThreshold: number;
  uniqueOverrides?: Partial<Omit<LootGroup, "valueThreshold" | "name">>;
};
