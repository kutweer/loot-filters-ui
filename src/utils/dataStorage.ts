import { useEffect, useState } from "react";
import { FilterModule } from "../types/FilterModule";

export const LOOT_FILTER_CONFIG_KEY = "loot-filter-configs";

export type Filter = {
  name: string;
  modules: FilterModule[];
};

export type StoredData = {
  filters: Filter[];
  selectedFilterIndex?: number;
};

const defaultData: StoredData = {
  filters: [],
  selectedFilterIndex: undefined,
};

const loadConfigs = (): StoredData => {
  const localData = localStorage.getItem(LOOT_FILTER_CONFIG_KEY);
  if (!localData) {
    return defaultData;
  } else {
    const data: StoredData = JSON.parse(localData);
    return { ...defaultData, ...data };
  }
};

const storeConfigs = (data: StoredData) => {
  localStorage.setItem(LOOT_FILTER_CONFIG_KEY, JSON.stringify(data));
};

export type StoredDataUpdater = (
  updater: (prev: StoredData) => StoredData
) => void;

export const updateOneFilter = (
  storedDataUpdater: StoredDataUpdater,
  filterName: string,
  filterUpdater: (prev: Filter) => Filter
) => {
  storedDataUpdater((prevStoredData) => {
    return {
      ...prevStoredData,
      filters: prevStoredData.filters.map((filter) => {
        if (filter.name === filterName) {
          const updated = filterUpdater(filter);
          return updated;
        } else {
          return filter;
        }
      }),
    };
  });
};

export const useLootFilterUiLocalStorage: () => [
  StoredData,
  Filter,
  StoredDataUpdater,
] = () => {
  const [data, setData] = useState<StoredData>(loadConfigs());
  const [activeFilter, setActiveFilter] = useState<Filter>(
    data.selectedFilterIndex
      ? data.filters[data.selectedFilterIndex]
      : data.filters[0]
  );

  useEffect(() => {
    storeConfigs(data);
  }, [data]);

  useEffect(() => {
    setActiveFilter(
      data.selectedFilterIndex
        ? data.filters[data.selectedFilterIndex]
        : data.filters[0]
    );
  }, [data.selectedFilterIndex]);

  return [data, activeFilter, setData];
};
