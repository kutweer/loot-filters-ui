// Don't export this, just use FilterType
const filterTypes = {
  boolean: "boolean",
  number: "number",
  stringlist: "stringlist",
  enumlist: "enumlist",
  includeExcludeList: "includeExcludeList",
  style: "style",
} as const;

// Types for fields that can change depending on the input type
export type Input =
  | NumberInput
  | BooleanInput
  | StringListInput
  | EnumListInput
  | IncludeExcludeListInput
  | StyleInput;
export type FilterType = keyof typeof filterTypes;
export type InputDefault<I extends Input> = I["default"];
export type ModuleName = string;
export type MacroName = string;

interface FilterModuleInputBase<T extends FilterType> {
  type: T;
  // The label of the input in the UI
  label: string;
  // Used to group related inputs in the UI ie a style input with a related enum list
  group?: string;
  // The name of the macro that will be updated in the rs2f text
  macroName: string;
}

export interface FilterModuleInput<T extends FilterType>
  extends FilterModuleInputBase<T> {
  // This is overridden by child types
  default: never;
}

export type BooleanInput = Omit<FilterModuleInput<"boolean">, "default"> & {
  default: boolean;
};

export type NumberInput = {
  default: number;
} & Omit<FilterModuleInput<"number">, "default">;

export type StringListInput = {
  default: string[] | ListOption[];
} & Omit<FilterModuleInput<"stringlist">, "default">;

export type ListOption = { label: string; value: string };
export type EnumListInput = {
  // always just values not labels avoids needing to redefine the enum
  default: string[];
  enum: string[] | ListOption[];
} & Omit<FilterModuleInput<"enumlist">, "default">;

export type IncludeExcludeListInputDefaults = {
  includes: string[] | ListOption[];
  excludes: string[] | ListOption[];
};

export type IncludeExcludeListInput = Omit<
  Omit<FilterModuleInput<"includeExcludeList">, "default">,
  "macroName"
> & {
  macroName: {
    includes: string;
    excludes: string;
  };
  default: IncludeExcludeListInputDefaults;
};

// Enum ordinal needs to match what is supported in the plugin
export const textAccentFromOrdinal = (ordinal: number): TextAccent => {
  return Object.values(TextAccent)[ordinal];
};

export const textAccentOrdinal = (textAccent: TextAccent): number => {
  return Object.values(TextAccent).indexOf(textAccent);
};
export enum TextAccent {
  SHADOW = "shadow",
  OUTLINE = "outline",
  NONE = "none",
  SHADOW_BOLD = "shadow_bold",
}

// Enum ordinal needs to match what is supported in the plugin

export const fontTypeOrdinal = (fontType: FontType): number => {
  return Object.values(FontType).indexOf(fontType);
};

export const fontTypeFromOrdinal = (ordinal: number): FontType => {
  return Object.values(FontType)[ordinal];
};
export enum FontType {
  NORMAL = "Normal",
  LARGER = "Larger",
  BOLD = "Bold",
}

/**
 * @pattern ^#([0-9a-fA-F]{8})$
 *
 * All colors in loot-filters are encoded in the, #AARRGGBB hex format.
 */
export type ArgbHexColor = `#${string}`;

export type StyleInput = Omit<FilterModuleInput<"style">, "default"> & {
  default: {
    textColor: ArgbHexColor;
    backgroundColor: ArgbHexColor;
    borderColor: ArgbHexColor;
    textAccent: number; // TextAccent;
    textAccentColor: ArgbHexColor;
    fontType: number; // FontType;
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
    tileHighlightColor: ArgbHexColor;
  };
};
