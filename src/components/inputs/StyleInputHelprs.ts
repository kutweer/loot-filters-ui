import { StyleInput } from "../../types/ModularFilterSpec";

export type StyleConfig = Partial<StyleInput["default"]>;
export type StyleConfigKey = keyof StyleConfig & string;

export const defaultOrConfigOrNone = <T extends StyleConfigKey>(
  key: T,
  styleInput: StyleInput,
  activeConfiguration: StyleConfig,
): StyleConfig[T] | undefined => {
  const activeConfigValue = activeConfiguration?.[key];
  if (activeConfigValue) {
    return activeConfigValue as StyleConfig[T];
  }

  const styleInputDefault = styleInput.default?.[key];
  if (styleInputDefault) {
    return styleInputDefault as StyleConfig[T];
  }

  return undefined;
};

export const updateStyleConfig = (
  styleKey: StyleConfigKey,
  value: StyleConfig[StyleConfigKey],
  styleInput: StyleInput,
  activeConfiguration: StyleConfig,
  updateConfigurationForActiveFilter: (configuration: StyleConfig) => void,
) => {
  const newConfiguration = {
    ...activeConfiguration,
    [styleInput.macroName as string]: {
      ...(activeConfiguration[styleInput.macroName as string] || {}),
      [styleKey]: value,
    },
  };

  updateConfigurationForActiveFilter(newConfiguration);
};
