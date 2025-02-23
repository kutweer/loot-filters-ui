import { SetStateAction, useState } from "react";

const defaultConfig: Record<string, any> = {
  devMode: false,
};

export const useSiteConfig = () => {
  const config = JSON.parse(
    localStorage.getItem("loot-filter-site-config") || "{}",
  );
  const configWithDefaults = { ...config };

  for (const key in defaultConfig) {
    if (configWithDefaults[key] === undefined) {
      configWithDefaults[key] = defaultConfig[key];
    }
  }

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
