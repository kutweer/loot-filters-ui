import { mapObject } from "underscore";
import { create, StateCreator, StoreApi, useStore } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  FilterId,
  ModularFilterConfiguration,
  UiModularFilter,
} from "../types/ModularFilterSpec";

export interface ImportedFilterSlice {
  importedModularFilters: Record<string, UiModularFilter>;
  addImportedModularFilter: (filter: UiModularFilter) => void;
  setActiveFilterId: (filterId: FilterId) => void;
}

export interface FilterConfigurationSlice {
  filterConfigurations: Record<FilterId, ModularFilterConfiguration>;
  setFilterConfiguration: (
    filterId: FilterId,
    configuration: ModularFilterConfiguration
  ) => void;
}

const createImportedFilterSlice: StateCreator<
  ImportedFilterSlice & FilterConfigurationSlice,
  [],
  [],
  ImportedFilterSlice
> = (set) => ({
  importedModularFilters: {},
  addImportedModularFilter: (filter: UiModularFilter) =>
    set((state) => ({
      importedModularFilters: {
        ...state.importedModularFilters,
        [filter.id]: filter,
      },
    })),
  setActiveFilterId: (filterId: FilterId) =>
    set((state) => ({
      importedModularFilters: {
        ...mapObject(state.importedModularFilters, (filter) => ({
          ...filter,
          active: filter.id === filterId,
        })),
      },
    })),
});

const createFilterConfigurationSlice: StateCreator<
  FilterConfigurationSlice,
  [],
  [],
  FilterConfigurationSlice
> = (set) => ({
  filterConfigurations: {},
  setFilterConfiguration: (
    filterId: FilterId,
    configuration: ModularFilterConfiguration
  ) =>
    set((state) => ({
      filterConfigurations: {
        ...state.filterConfigurations,
        [filterId]: configuration,
      },
    })),
});

export interface DeleteFilterSlice {
  deleteFilter: (filterId: FilterId) => void;
}

const createDeleteFilterSlice: StateCreator<
  ImportedFilterSlice & FilterConfigurationSlice & DeleteFilterSlice,
  [],
  [],
  DeleteFilterSlice
> = (set) => ({
  deleteFilter: (filterId: FilterId) =>
    set((state) => ({
      importedModularFilters: Object.fromEntries(
        Object.entries(state.importedModularFilters).filter(
          ([key]) => key !== filterId
        )
      ),
      filterConfigurations: Object.fromEntries(
        Object.entries(state.filterConfigurations).filter(
          ([key]) => key !== filterId
        )
      ),
    })),
});

const uiStore = create<
  ImportedFilterSlice & FilterConfigurationSlice & DeleteFilterSlice
>()(
  devtools(
    persist(
      (...a) => ({
        ...createImportedFilterSlice(...a),
        ...createFilterConfigurationSlice(...a),
        ...createDeleteFilterSlice(...a),
      }),
      {
        name: "modular-filter-storage",
      }
    )
  )
);

const createBoundedUseStore = ((store) => (selector) =>
  useStore(store, selector)) as <S extends StoreApi<unknown>>(
  store: S
) => {
  (): ExtractState<S>;
  <T>(selector: (state: ExtractState<S>) => T): T;
};

type ExtractState<S> = S extends { getState: () => infer X } ? X : never;

export const useUiStore = createBoundedUseStore(uiStore);
