import { UiModularFilter } from "../types/ModularFilter";
import { FilterModuleInput, filterTypes } from "../types/ModularFilterSpec";

export type ModularFilterId = string;
export type ModularFilterConfigurationId = string;

export type InputDefault<T extends keyof typeof filterTypes> =
  FilterModuleInput<T>["default"];
export type ModularFilterConfiguration<T extends keyof typeof filterTypes> =
  Record<string, InputDefault<T>>;

export type UiData = {
  importedModularFilters: Record<string, UiModularFilter>;
  filterConfigurations: Record<ModularFilterId, ModularFilterConfiguration<keyof typeof filterTypes>>;
  activeFilterId?: ModularFilterId;
};

type Getter<T> = ((uiData: UiData) => T | undefined) | string;

export const loadData = <T,>(localstorageKey: string, getter: Getter<T>): T | undefined => {
  const data = localStorage.getItem(localstorageKey);
  if (typeof getter !== "string") {
    return getter(
      data
        ? JSON.parse(data)
        : {
            importedModularFilters: {},
            filterConfigurations: {},
            activeFilterId: undefined,
          }
    );
  } else {
    return data ? JSON.parse(data)[getter] : undefined;
  }
};

export const setData = <T,>(localstorageKey: string, path: string[], value: T) => {
    const data = localStorage.getItem(localstorageKey);
    const parsedData = data ? JSON.parse(data) : {};

    let current = parsedData;
    for (let i = 0; i < path.length - 1; i++) {
        if (!(path[i] in current)) {
            current[path[i]] = {};
        }
        current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    localStorage.setItem(localstorageKey, JSON.stringify(parsedData));
    return parsedData;
}
