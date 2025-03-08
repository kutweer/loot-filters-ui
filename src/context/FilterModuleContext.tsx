import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { FilterModule, filterTypes } from "../types/ModularFilterSpec";
import {
  loadData,
  ModularFilterConfiguration,
  ModularFilterId,
  setData,
  UiData,
} from "../utils/storage";
type FilterModuleContextType = {
  activeConfig: ModularFilterConfiguration<keyof typeof filterTypes>;
  setActiveConfig: (
    activeConfig: ModularFilterConfiguration<keyof typeof filterTypes>
  ) => void;
  module: FilterModule;
};

const FilterModuleContext = createContext<FilterModuleContextType | undefined>(
  undefined
);

export const useFilterModule = (): FilterModuleContextType => {
  const context = useContext(FilterModuleContext);
  if (context === undefined) {
    throw new Error(
      "useFilterModule must be used within a FilterModuleProvider"
    );
  }
  return context;
};

interface FilterModuleProviderProps {
  children: ReactNode;
  activeFilterId: ModularFilterId;
  module: FilterModule;
}

export const FilterModuleProvider = ({
  children,
  activeFilterId,
  module,
}: FilterModuleProviderProps) => {
  const activeConfigInitial: ModularFilterConfiguration<
    keyof typeof filterTypes
  > =
    loadData("ui-data", (uiData: UiData) => {
      return uiData.filterConfigurations[activeFilterId];
    }) ?? {};

  const [activeConfig, setActiveConfig] =
    useState<ModularFilterConfiguration<keyof typeof filterTypes>>(
      activeConfigInitial
    );

  useEffect(() => {
    setData("ui-data", ["filterConfigurations", activeFilterId], activeConfig);
  }, [activeConfig]);

  return (
    <FilterModuleContext.Provider
      value={{ activeConfig, setActiveConfig, module }}
    >
      {children}
    </FilterModuleContext.Provider>
  );
};
