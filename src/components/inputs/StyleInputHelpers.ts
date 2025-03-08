import { StyleInput } from "../../types/InputsSpec";
import {
  ModularFilterConfiguration,
  readConfigValue,
  ModuleId,
} from "../../types/ModularFilterSpec";

export type StyleConfig = Partial<StyleInput["default"]>;
export type StyleConfigKey = keyof StyleConfig & string;

export const readConfigStyleField = <T extends StyleConfigKey>(
  field: T,
  moduleId: ModuleId,
  input: StyleInput,
  activeConfig: ModularFilterConfiguration
) => {
  return readConfigValue<{ [key in T]: StyleConfig[T] }>(
    module.id,
    input.macroName,
    activeConfig
  )?.[field];
};
