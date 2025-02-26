import { SetStateAction, useState } from "react";

export type SiteConfig = {
  devMode: boolean;
};

const defaultConfig: SiteConfig = {
  devMode: false,
};

export const useSiteConfig = () => {
  const config = JSON.parse(
    localStorage.getItem("loot-filter-site-config") || "{}",
  );
  const configWithDefaults = { ...defaultConfig, ...config };

  const [configState, setConfigState] = useState(configWithDefaults);

  return [
    configState,
    (action: SetStateAction<Record<string, any>>) => {
      const newConfig = typeof action === "function" ? action(config) : action;

      setConfigState(newConfig);
      localStorage.setItem(
        "loot-filter-site-config",
        JSON.stringify(newConfig),
      );
    },
  ];
};

export default useSiteConfig;
