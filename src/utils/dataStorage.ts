import { SetStateAction, useEffect, useState } from "react";
import { Module } from "../types/FilterModule";
import { FilterSource } from "./filtermanager";

export const LOOT_FILTER_CONFIG_KEY = "loot-filter-configs";

export type Filter = {
  source: FilterSource;
  name: string;
  description: string;
  modules: Module[];
  importedOn: string;
};

export type StoredData = {
  filters: Filter[];
  selectedFilterIndex: number;
};

const defaultData: StoredData = {
  filters: [],
  selectedFilterIndex: -1,
};

export const loadConfigs = (): StoredData => {
  const localData = localStorage.getItem(LOOT_FILTER_CONFIG_KEY);
  if (!localData) {
    return defaultData;
  } else {
    const data: StoredData = JSON.parse(localData);
    return { ...defaultData, ...data };
  }
};

export const storeConfigs = (data: StoredData) => {
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

