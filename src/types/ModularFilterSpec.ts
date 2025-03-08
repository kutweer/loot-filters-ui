import {
  IncludeExcludeListInput,
  IncludeExcludeListInputDefaults,
  Input,
  InputDefault,
} from "./InputsSpec";

// ### ### ### ### ###
//
// MODULE SYSTEM SPEC
// These types represent the files that get put into a repo that make up the filter.
//
// ### ### ### ### ###

/**
 * An importable filter - in the future this may also support a base64'd definition etc.
 */
export type FilterSource =
  | {
      filterUrl: string;
    }
  | FilterDefinition;

/**
 * A module source - this can be a url to a json file or a local file
 */
export type ModuleSource =
  | {
      name: string;
      moduleJsonUrl: string;
      moduleRs2fUrl: string;
    }
  | {
      name: string;
      moduleJson: FilterModule;
      moduleRs2fText: string;
    };

/**
 * A filter definition - this is the actual filter definition that you'll see in a repository
 * In a typical use-case the modules property is a list of sources, but modules may be inlined as well.
 */
export type FilterDefinition = {
  name: string;
  description: string;
  modules: (ModuleSource | FilterModule)[];
};

/**
 * This is what you'd put in a moudle file
 * Actual input definitions are in InputsSpec
 */
export type FilterModule = {
  name: string;
  description?: string;
  inputs: Input[];
};

// ### ### ### ### ###
//
// UI TYPES
// These types extends the above types to add UI specific information like Ids, configuration, types etc.
//
// ### ### ### ### ###

// The key here is the MacroName - for inputs with multiple macro names each one has a unique key
export type ModularFilterConfiguration = Record<string, InputDefault<Input>>;

// Helper function to get the correctly typed value from the configuration
export const readConfigValue = <
  T extends Exclude<Input, IncludeExcludeListInput>,
>(
  input: T,
  config: ModularFilterConfiguration
): InputDefault<T> => {
  return config[input.macroName] as InputDefault<T>;
};

export const readConfigValueIncludeExcludeList = (
  input: IncludeExcludeListInput,
  field: "includes" | "excludes",
  config: ModularFilterConfiguration
): IncludeExcludeListInputDefaults[typeof field] => {
  return config[input.macroName[field]] as IncludeExcludeListInputDefaults[typeof field]
};

// This is a 'loaded filter' before we add the ui specific information
// Only used in the loader
export type ModularFilter = {
  name: string;
  description: string;
  modules: FilterModule[];
};

// ### ### ### ### ###
//
// Persisted UI TYPES
// These are the types we persist to localStorage; have some additional information
// and are used by the UI for display purposes like which filter is 'active' etc.
//
// ### ### ### ### ###

// Usually a UUID - allows for non-user-supplied unique keys
/**
 * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
 */
export type FilterId = string;

/**
 * @pattern ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
 */
export type ModuleId = string;

export type UiModularFilter = {
  id: FilterId;
  importedOn: string; // ISO string ie. new Date().toISOString()
  source?: FilterSource; // The source we imported from. In the future will use this to check for updates etc.
  modules: UiFilterModule[];
  active: boolean;
} & ModularFilter;




export type UiFilterModule = {
  id: ModuleId;
  rs2fText: string;
  source?: ModuleSource;
} & FilterModule;
