import { SetStateAction, useState } from "react";

export type SiteConfig = {
  devMode: boolean;
  isLocal: boolean;
};

const defaultConfig: SiteConfig = {
  devMode: false,
  isLocal: false,
};

export const useSiteConfig = (): [
  SiteConfig,
  (action: SetStateAction<SiteConfig>) => void,
] => {
  const config = JSON.parse(
    localStorage.getItem("loot-filter-site-config") || "{}"
  );
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  const configWithDefaults = { ...defaultConfig, ...config, isLocal };

  const [configState, setConfigState] = useState(configWithDefaults);

  return [
    configState,
    (action: SetStateAction<Record<string, any>>) => {
      const newConfig = typeof action === "function" ? action(config) : action;

      setConfigState(newConfig);
      localStorage.setItem(
        "loot-filter-site-config",
        JSON.stringify(newConfig)
      );
    },
  ];
};

export default useSiteConfig;
