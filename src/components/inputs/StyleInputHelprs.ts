import { StyleInput } from "../../types/InputsSpec";

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

