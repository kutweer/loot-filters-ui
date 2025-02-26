import { useEffect, useState } from "react";
import { DEFAULT_CONFIG } from "../filterscape/Filterscape";
import { FilterConfig } from "../types/FilterTypes";

export const LOOT_FILTER_CONFIG_KEY = "loot-filter-configs";

export type LootFilterUiData = {
    configs: FilterConfig[];
}

const loadConfigs = (): LootFilterUiData => {
    const data: LootFilterUiData = JSON.parse(localStorage.getItem(LOOT_FILTER_CONFIG_KEY) || '{"configs": []}')

    if (data.configs.length > 0) {
        return data;
    } else {
        return { configs: [DEFAULT_CONFIG] }
    }
}

const storeConfigs = (data: LootFilterUiData) => {
    localStorage.setItem(LOOT_FILTER_CONFIG_KEY, JSON.stringify(data))
}

export const useStoredConfigs: () => [LootFilterUiData, (updater: (prev: LootFilterUiData) => LootFilterUiData) => void] = () => {
    const [data, setData] = useState<LootFilterUiData>(loadConfigs())

    useEffect(() => {
        storeConfigs(data)
    }, [data])

    return [data, setData]
}