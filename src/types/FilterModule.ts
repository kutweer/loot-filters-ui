import { ArgbHexColor } from "../utils/Color";
import { FontType, TextAccent } from "./FilterTypes";

export type Module = {
  name: string;
  input: ModuleInput[];
};

export type inputTypes = {
  itemlist: {
    enum?: string[];
  };
  style: {
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

export type ModuleInput<T extends keyof inputTypes = keyof inputTypes> = {
  name: string;
  label: string;
  type: T;
  default: Partial<inputTypes[T]>;
  overrides: Partial<inputTypes[T]>;
};
