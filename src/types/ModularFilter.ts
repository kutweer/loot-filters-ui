import { FilterModule, ModularFilter } from "./ModularFilterSpec";

// import { ArgbHexColor } from "../utils/Color";
export type ArgbHexColor = `#${string}`;
/**
 * Sources - how we load the filter data
 */
export type FilterSource = { filterUrl: string };

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
 * Definitions - the actual filter data - extends beydon the schema.json in order to pipe through things
 * like the rs2f text, and the source url.
 */

export type UiModularFilter = {
  id: string;
  importedOn: string; // ISO string
  source?: FilterSource;
  modules: UiFilterModule[];
} & ModularFilter;

export type UiFilterModule = FilterModule & {
  rs2fText: string;
  source?: ModuleSource;
};
