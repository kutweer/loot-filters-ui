import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { UiModularFilter } from "../types/ModularFilter";
import { FilterModuleInput, filterTypes } from "../types/ModularFilterSpec";

export type ModularFilterId = string;
export type ModularFilterConfigurationId = string;

export type ModularFilterDefault<T extends keyof typeof filterTypes> =
  FilterModuleInput<T>["default"];
export type ModularFilterConfiguration<T extends keyof typeof filterTypes> =
  Record<string, ModularFilterDefault<T>>;

export type UiData = {
  importedModularFilters: Record<string, UiModularFilter>;
  filterConfigurations: Record<ModularFilterId, Record<string, any>>;
  activeFilterId?: ModularFilterId;
};

export const loadData = () => {
  const data = localStorage.getItem("ui-data");
  return data
    ? JSON.parse(data)
    : {
        importedModularFilters: {},
        filterConfigurations: {},
      };
};
