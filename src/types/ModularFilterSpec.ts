import { isArray, isObject } from "underscore";
/**
 * Definitions - the actual filter data - extends beydon the schema.json in order to pipe through things
 * like the rs2f text, and the source url.
 */

export type ModularFilter = {
  name: string;
  description: string;
  modules: FilterModule[];
};

export type FilterModule = {
  name: string;
  description?: string;
  inputs: (
    | BooleanInput
    | NumberInput
    | StringListInput
    | EnumListInput
    | IncludeExcludeListInput
    | StyleInput
  )[];
};

/**
 * Inputs - the input types for the filter module
 */

export const filterTypes = {
  boolean: "boolean",
  number: "number",
  stringlist: "stringlist",
  enumlist: "enumlist",
  includeExcludeList: "includeExcludeList",
  style: "style",
} as const;

export type FilterModuleInput<T extends keyof typeof filterTypes> = {
  type: T;
  macroName: string | { includes: string; excludes: string };
  label: string;
  default: any;
  group?: string;
};

export type BooleanInput = FilterModuleInput<"boolean"> & {
  default: boolean;
};

export type NumberInput = FilterModuleInput<"number"> & {
  default: number;
};

export type StringListInput = FilterModuleInput<"stringlist"> & {
  default: string[];
};

export type EnumListInput = FilterModuleInput<"enumlist"> & {
  default: string[];
  enum: string[];
};

export type IncludeExcludeListInputDefaults = {
  includes: string[];
  excludes: string[];
};

export type IncludeExcludeListInput =
  FilterModuleInput<"includeExcludeList"> & {
    macroName: {
      includes: string;
      excludes: string;
    };
    default: IncludeExcludeListInputDefaults;
  };

export enum TextAccent {
  SHADOW = "shadow",
  OUTLINE = "outline",
  NONE = "none",
  BOLD = "bold",
}

export const textAccentFromOrdinal = (ordinal: number): TextAccent => {
  return Object.values(TextAccent)[ordinal];
};

export const textAccentOrdinal = (textAccent: TextAccent): number => {
  return Object.values(TextAccent).indexOf(textAccent);
};

export enum FontType {
  NORMAL = "normal",
  LARGER = "larger",
  BOLD = "bold",
}

export const fontTypeOrdinal = (fontType: FontType): number => {
  return Object.values(FontType).indexOf(fontType);
};

export const fontTypeFromOrdinal = (ordinal: number): FontType => {
  return Object.values(FontType)[ordinal];
};

/**
 * @pattern ^#([0-9a-fA-F]{8})$
 */
export type ArgbHexColor = `#${string}`;

export type StyleInput = FilterModuleInput<"style"> & {
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
  };
};

export const validateFilterModuleInput = (
  filter: ModularFilter,
  checkModules = false,
) => {
  assertString(filter, "name");
  assertString(filter, "description");

  if (checkModules) {
    filter.modules.forEach((module: FilterModule) => {
      assertString(module, "name");
      assertString(module, "description", true);
      validateModule(module);
    });
  }
};

export const validateModule = (module: FilterModule) => {
  console.log("validateModule", module);
  module.inputs.forEach((input: FilterModuleInput<any>) => {
    checkObjectProperty(input, "macroName", "string");

    switch (input.type) {
      case "boolean":
        checkObjectProperty(input as BooleanInput, "default", "boolean");
        break;
      case "number":
        checkObjectProperty(input as NumberInput, "default", "number");
        break;
      case "stringlist":
        checkArrayProperty((input as StringListInput).default, "string");
        break;
      case "enumlist":
        checkArrayProperty((input as EnumListInput).default, "string");
        break;
      case "includeExcludeList":
        checkArrayProperty(
          (input as IncludeExcludeListInput).default.includes,
          "string",
        );
        checkArrayProperty(
          (input as IncludeExcludeListInput).default.excludes,
          "string",
        );
        break;
      case "style":
        if (!isObject(input.default)) {
          throw new Error(`Value ${input.default} is not an object`);
        }
        checkObjectProperty(input.default, "textColor", "string", true);
        checkObjectProperty(input.default, "backgroundColor", "string", true);
        checkObjectProperty(input.default, "borderColor", "string", true);
        checkObjectProperty(input.default, "textAccent", "number", true);
        checkObjectProperty(input.default, "textAccentColor", "string", true);
        checkObjectProperty(input.default, "fontType", "number", true);
        checkObjectProperty(input.default, "showLootbeam", "boolean", true);
        checkObjectProperty(input.default, "lootbeamColor", "string", true);
        checkObjectProperty(input.default, "showValue", "boolean", true);
        checkObjectProperty(input.default, "showDespawn", "boolean", true);
        checkObjectProperty(input.default, "notify", "boolean", true);
        checkObjectProperty(input.default, "hideOverlay", "boolean", true);
        checkObjectProperty(input.default, "highlightTile", "boolean", true);
        checkObjectProperty(input.default, "menuTextColor", "string", true);
        checkObjectProperty(input.default, "tileStrokeColor", "string", true);
        checkObjectProperty(input.default, "tileFillColor", "string", true);
        break;
    }
  });
};

const assertString = (value: any, key: string, optional = false) => {
  checkObjectProperty(value, key, "string", optional);
};

const checkArrayProperty = (value: any, type: string, optional = false) => {
  if (value === undefined || value === null) {
    if (!optional) {
      throw new Error(`Value ${value} is undefined`);
    }
    return;
  }

  if (!isArray(value)) {
    throw new Error(`Value ${value} is not an array`);
  }

  value.forEach((item: any) => {
    if (typeof item !== type) {
      throw new Error(`Value ${item} is not of type ${type}`);
    }
  });
};

const checkObjectProperty = (
  value: any,
  key: string,
  type: string,
  optional = false,
) => {
  console.log("checkObjectProperty", value, key, type, optional);
  if (!isObject(value)) {
    throw new Error(`Value ${value} is not an object`);
  }

  if (!Object.keys(value).includes(key)) {
    if (!optional) {
      throw new Error(`Value ${JSON.stringify(value)} has no property ${key} of type ${type}`);
    }
    return;
  }

  if (typeof value[key] !== type) {
    throw new Error(
      `Value ${JSON.stringify(value)} has property ${key} of type ${typeof value[key]} instead of ${type}`,
    );
  }

  return value[key];
};
