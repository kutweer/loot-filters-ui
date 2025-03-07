import { loadData, ModularFilterConfiguration } from "../utils/storage";
import { UiModularFilter } from "../types/ModularFilter";
import { ModularFilterId } from "../utils/storage";
import { UiData } from "../utils/storage";
import { filterTypes } from "../types/ModularFilterSpec";
import { useEffect } from "react";
import { useState } from "react";
import { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";

export type DataContext = {
  data: UiData;
  setActiveFilter: (filterId?: ModularFilterId) => void;

  addNewImportedModularFilter: (
    id: ModularFilterId,
    filter: UiModularFilter,
  ) => void;

  updateConfigurationForActiveFilter: (
    configuration: Partial<
      ModularFilterConfiguration<keyof typeof filterTypes>
    >,
  ) => void;

  removeFilterConfiguration: (filterId: ModularFilterId) => void;
  setModularFilterRemoved: (filterId: ModularFilterId) => void;

  getActiveFilterConfiguration: () => ModularFilterConfiguration<
    keyof typeof filterTypes
  >;

  getActiveFilter: () => UiModularFilter | undefined;
};

const DataContext = createContext<DataContext | undefined>(undefined);

export const useData = (): DataContext => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [data, setData] = useState<UiData>(loadData());

  useEffect(() => {
    localStorage.setItem("ui-data", JSON.stringify(data));
  }, [data]);

  const setActiveFilter = (filterId?: ModularFilterId) => {
    setData((prev) => ({
      ...prev,
      activeFilterId: filterId,
    }));
  };

  const addNewImportedModularFilter = (
    id: ModularFilterId,
    filter: UiModularFilter,
  ) => {
    setData((prev) => ({
      ...prev,
      importedModularFilters: {
        ...prev.importedModularFilters,
        [id]: filter,
      },
    }));
  };

  const updateConfigurationForActiveFilter = (
    configuration: ModularFilterConfiguration<keyof typeof filterTypes>,
  ) => {
    setData((prev) => ({
      ...prev,
      filterConfigurations: {
        ...prev.filterConfigurations,
        [prev.activeFilterId!!]: {
          ...(prev.filterConfigurations[prev.activeFilterId!!] ?? {}),
          ...configuration,
        },
      },
    }));
  };

  const removeFilterConfiguration = (filterId: ModularFilterId) => {
    setData((prev) => {
      const newFilterConfigurations = {
        ...prev.filterConfigurations,
      };
      delete newFilterConfigurations[filterId];
      return {
        ...prev,
        filterConfigurations: newFilterConfigurations,
      };
    });
  };

  const setModularFilterRemoved = (filterId: ModularFilterId) => {
    setData((prev) => {
      const newImportedModularFilters = {
        ...prev.importedModularFilters,
      };
      delete newImportedModularFilters[filterId];
      return {
        ...prev,
        importedModularFilters: newImportedModularFilters,
      };
    });
  };

  const getActiveFilterConfiguration = () => {
    return data.activeFilterId
      ? data.filterConfigurations[data.activeFilterId]
      : {};
  };

  const getActiveFilter = () => {
    return data.activeFilterId
      ? data.importedModularFilters[data.activeFilterId]
      : undefined;
  };

  const value = {
    data,
    setActiveFilter,
    addNewImportedModularFilter,
    updateConfigurationForActiveFilter,
    removeFilterConfiguration,
    setModularFilterRemoved,
    getActiveFilterConfiguration,
    getActiveFilter,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
