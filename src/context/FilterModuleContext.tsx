import { createContext, ReactNode, useContext, useState } from "react";
import { FilterModuleInput, filterTypes } from "../types/ModularFilterSpec";
import { ModularFilterConfiguration } from "../utils/storage";
import { useData } from "./UiDataContext";
type FilterModuleContextType = {
  input: FilterModuleInput<keyof typeof filterTypes>;
  activeConfiguration: ModularFilterConfiguration<keyof typeof filterTypes>;
  updateConfiguration: (
    configuration: Partial<
      ModularFilterConfiguration<keyof typeof filterTypes>
    >,
  ) => void;
};

const FilterModuleContext = createContext<FilterModuleContextType | undefined>(
  undefined,
);

export const useFilterModule = (): FilterModuleContextType => {
  const context = useContext(FilterModuleContext);
  if (context === undefined) {
    throw new Error(
      "useFilterModule must be used within a FilterModuleProvider",
    );
  }
  return context;
};

interface FilterModuleProviderProps {
  children: ReactNode;
  input: FilterModuleInput<keyof typeof filterTypes>;
}

export const FilterModuleProvider = ({
  children,
  input,
}: FilterModuleProviderProps) => {
  const { getActiveFilterConfiguration, updateConfigurationForActiveFilter } =
    useData();

  const activeConfiguration = getActiveFilterConfiguration();

  const updateConfiguration = (
    configuration: Partial<
      ModularFilterConfiguration<keyof typeof filterTypes>
    >,
  ) => {
    updateConfigurationForActiveFilter(configuration);
  };

  const value = {
    input,
    activeConfiguration,
    updateConfiguration,
  };

  return (
    <FilterModuleContext.Provider value={value}>
      {children}
    </FilterModuleContext.Provider>
  );
};
