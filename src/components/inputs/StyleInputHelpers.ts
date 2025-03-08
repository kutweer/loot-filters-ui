import { StyleInput } from "../../types/InputsSpec";
import {
  ModularFilterConfiguration,
  ModuleId,
} from "../../types/ModularFilterSpec";

export type StyleConfig = Partial<StyleInput["default"]>;
export type StyleConfigKey = keyof StyleConfig & string;


