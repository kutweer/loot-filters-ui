import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { UiModularFilter } from "../types/ModularFilter";
import { loadData, ModularFilterId, setData } from "../utils/storage";

export type DataContext = {
  importedModularFilters: Record<ModularFilterId, UiModularFilter>;
  activeFilterId: ModularFilterId | undefined;
  setActiveFilter: (filterId?: ModularFilterId) => void;

  addNewImportedModularFilter: (
    id: ModularFilterId,
    filter: UiModularFilter
  ) => void;

  removeFilterConfiguration: (filterId: ModularFilterId) => void;
  setModularFilterRemoved: (filterId: ModularFilterId) => void;

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
  const { importedModularFilters, activeFilterId } = loadData(
    "ui-data",
    (uiData) => {
      return {
        importedModularFilters: uiData.importedModularFilters || undefined,
        activeFilterId: uiData.activeFilterId || undefined,
      };
    }
  )!!;

  const [importedModularFiltersState, setImportedModularFilters] = useState<
    Record<ModularFilterId, UiModularFilter>
  >(importedModularFilters);

  useEffect(() => {
    console.log(
      "useEffect importedModularFiltersState",
      importedModularFiltersState
    );
    setData("ui-data", (uiData) => ({
      ...uiData,
      importedModularFilters: importedModularFiltersState,
    }));
  }, [importedModularFilters]);

  const [activeFilterIdState, setActiveFilterId] = useState<
    ModularFilterId | undefined
  >(activeFilterId);

  useEffect(() => {
    setData("ui-data", (uiData) => ({
      ...uiData,
      activeFilterId: activeFilterIdState,
    }));
  }, [activeFilterIdState]);

  const setActiveFilter = useCallback(
    (filterId?: ModularFilterId) => {
      setActiveFilterId(filterId);
    },
    [setActiveFilterId]
  );

  const addNewImportedModularFilter = useCallback(
    (id: ModularFilterId, filter: UiModularFilter) => {
      setImportedModularFilters((prev) => ({
        ...prev,
        [id]: filter,
      }));
    },
    [setImportedModularFilters]
  );

  const removeFilterConfiguration = useCallback(
    (filterId: ModularFilterId) => {
      setImportedModularFilters(
        (prev: Record<ModularFilterId, UiModularFilter>) => {
          const newConfigurations = { ...prev };
          delete newConfigurations[filterId];
          return newConfigurations;
        }
      );
    },
    [setImportedModularFilters]
  );

  const setModularFilterRemoved = useCallback(
    (filterId: ModularFilterId) => {
      setImportedModularFilters(
        (prev: Record<ModularFilterId, UiModularFilter>) => {
          const newImportedModularFilters = { ...prev };
          delete newImportedModularFilters[filterId];
          return newImportedModularFilters;
        }
      );
    },
    [setImportedModularFilters]
  );

  const getActiveFilter = useCallback(() => {
    return activeFilterId ? importedModularFilters[activeFilterId] : undefined;
  }, [importedModularFilters, activeFilterId]);

  const contextValue = {
    importedModularFilters: importedModularFiltersState,
    activeFilterId: activeFilterIdState,
    setActiveFilter,
    addNewImportedModularFilter,
    removeFilterConfiguration,
    setModularFilterRemoved,
    getActiveFilter,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};
