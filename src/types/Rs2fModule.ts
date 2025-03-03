import { ArgbHexColor } from "./Color";
import { FontType, TextAccent } from "./FilterTypes2";

export type Rs2fModule = {
  name: string;
  input: Rs2fModuleInput[];
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

export type Rs2fModuleInput = {
  name: string;
  label: string;
} & Partial<inputTypes[keyof inputTypes]>;
