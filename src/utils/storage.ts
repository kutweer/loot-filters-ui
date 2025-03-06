import { useEffect, useState } from "react";
import { UiModularFilter } from "../types/ModularFilter";
import { FilterModuleInput, filterTypes } from "../types/ModularFilterSpec";

export type ModularFilterId = string;
export type ModularFilterConfigurationId = string;

// TODO define this
export type ModularFilterConfiguration<T extends keyof typeof filterTypes> =
  Record<string, FilterModuleInput<T>["default"]>;

export type UiData = {
  importedModularFilters: Record<string, UiModularFilter>;

  filterConfigurations: Record<ModularFilterId, Record<string, any>>;

  activeFilterId?: ModularFilterId;
  activeFilterConfigurationId?: ModularFilterConfigurationId;
};

const withUpdatedActiveFilters = (
  uiData: UiData,
  filterId?: ModularFilterId,
  activeFilterConfigurationId?: ModularFilterConfigurationId,
) => {
  return {
    ...uiData,
    activeFilterId: filterId,
    activeFilterConfigurationId: activeFilterConfigurationId,
  };
};

const withNewImportedModularFilter = (
  uiData: UiData,
  id: ModularFilterId,
  filter: UiModularFilter,
) => {
  return {
    ...uiData,
    importedModularFilters: {
      ...uiData.importedModularFilters,
      [id]: filter,
    },
  };
};

const withFilterConfiguration = (
  uiData: UiData,
  filterId: ModularFilterId,
  configuration: Record<string, any>,
) => {
  return {
    ...uiData,
    filterConfigurations: {
      ...uiData.filterConfigurations,
      [filterId]: {
        ...(uiData.filterConfigurations[filterId] ?? {}),
        ...configuration,
      },
    },
  };
};

const withFilterConfigurationRemoved = (
  uiData: UiData,
  filterId: ModularFilterId,
) => {
  const newFilterConfigurations = {
    ...uiData.filterConfigurations,
  };
  delete newFilterConfigurations[filterId];
  return {
    ...uiData,
    filterConfigurations: newFilterConfigurations,
  };
};

const withModularFilterRemoved = (
  uiData: UiData,
  filterId: ModularFilterId,
) => {
  const newImportedModularFilters = {
    ...uiData.importedModularFilters,
  };
  delete newImportedModularFilters[filterId];
  return {
    ...uiData,
    importedModularFilters: newImportedModularFilters,
  };
};

const loadData = () => {
  const data = localStorage.getItem("ui-data");
  return data
    ? JSON.parse(data)
    : {
        importedModularFilters: {},
        filterConfigurations: {},
      };
};

export type SetActiveFilters = (
  filterId?: ModularFilterId,
  activeFilterConfigurationId?: ModularFilterConfigurationId,
) => void;
export type SetNewImportedModularFilter = (
  id: ModularFilterId,
  filter: UiModularFilter,
) => void;
export type SetFilterConfiguration = (
  filterId: ModularFilterId,
  configuration: Record<string, any>,
) => void;
export type SetFilterConfigurationRemoved = (filterId: ModularFilterId) => void;
export type SetModularFilterRemoved = (filterId: ModularFilterId) => void;

export type DataContext = {
  data: UiData;
  setActiveFilters: SetActiveFilters;
  setNewImportedModularFilter: SetNewImportedModularFilter;
  setFilterConfiguration: SetFilterConfiguration;
  setFilterConfigurationRemoved: SetFilterConfigurationRemoved;
  setModularFilterRemoved: SetModularFilterRemoved;
};

export const useData = (): DataContext => {
  const [data, setData] = useState<UiData>(loadData());

  useEffect(() => {
    localStorage.setItem("ui-data", JSON.stringify(data));
  }, [data]);

  const setActiveFilters = (
    filterId?: ModularFilterId,
    activeFilterConfigurationId?: ModularFilterConfigurationId,
  ) => {
    setData((prev) =>
      withUpdatedActiveFilters(prev, filterId, activeFilterConfigurationId),
    );
  };

  const setNewImportedModularFilter = (
    id: ModularFilterId,
    filter: UiModularFilter,
  ) => {
    setData((prev) => withNewImportedModularFilter(prev, id, filter));
  };

  const setFilterConfiguration = (
    filterId: ModularFilterId,
    configuration: ModularFilterConfiguration<keyof typeof filterTypes>,
  ) => {
    setData((prev) => withFilterConfiguration(prev, filterId, configuration));
  };

  const setFilterConfigurationRemoved = (filterId: ModularFilterId) => {
    setData((prev) => withFilterConfigurationRemoved(prev, filterId));
  };

  const setModularFilterRemoved = (filterId: ModularFilterId) => {
    setData((prev) => withModularFilterRemoved(prev, filterId));
  };

  return {
    data,
    setActiveFilters,
    setNewImportedModularFilter,
    setFilterConfiguration,
    setFilterConfigurationRemoved,
    setModularFilterRemoved,
  };
};
