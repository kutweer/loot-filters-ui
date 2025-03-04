import { ArgbHexColor } from "../utils/Color";
import { FontType, TextAccent } from "./FilterTypes";

export type FilterModule = {
  name: string;
  input: ModuleInput[];
};

export type inputTypes = {
  itemlist: {
    type: "itemlist";
    enum?: string[];
  };
  style: {
    type: "style";
    textColor: ArgbHexColor;
    backgroundColor: ArgbHexColor;
    borderColor: ArgbHexColor;
    textAccent: TextAccent;
    textAccentColor: ArgbHexColor;
    fontType: FontType;
    showLootbeam: boolean;
    lootbeamColor: ArgbHexColor;
    showValue: boolean;
    showDespawn: boolean;
    notify: boolean;
    hideOverlay: boolean;
    highlightTile: boolean;
    menuTextColor: ArgbHexColor;
    tileStrokeColor: ArgbHexColor;
    tileFillColor: ArgbHexColor;
  };
};

export type ModuleInput = {
  name: string;
  label: string;
} & Partial<inputTypes[keyof inputTypes]>;
