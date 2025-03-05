import { Module } from "../types/FilterModule";
import { Filter } from "./dataStorage";

export type FilterSource =
  | {
      url: string;
    }
  | {
      rawRilterJson: string;
    };

export type FilterDefinition = {
  name: string;
  description: string;
  modules: ModuleSource[];
};

export type ModuleSource =
  | {
      name: string;
      moduleJson: string;
      rs2f: string;
    }
  | {
      name: string;
      rawModuleJson: string;
      rawRs2f: string;
    };

export type ModuleDefinition = {
  name: string;
  moduleJson: Module;
  rs2f: string;
};

export const loadFilter = async (source: FilterSource): Promise<Filter> => {
  let filter: FilterDefinition;
  if ("rawRilterJson" in source) {
    filter = JSON.parse(source.rawRilterJson);
  } else {
    const response = await fetch(source.url);
    filter = (await response.json()) as FilterDefinition;
  }

  const resolvedSources = await Promise.all(
    filter.modules.map(async (moduleSource) => {
      return loadModule(moduleSource);
    })
  );

  return {
    name: filter.name,
    source: source,
    description: filter.description,
    modules: resolvedSources.map((m) => m.moduleJson),
    importedOn: new Date().toISOString(),
  };
};

const loadModule = async (
  moduleSource: ModuleSource
): Promise<ModuleDefinition> => {
  let module: Module | null = null;
  let rs2f: string | null = null;
  if ("rawModuleJson" in moduleSource) {
    module = JSON.parse(moduleSource.rawModuleJson);
  }
  if ("moduleJson" in moduleSource) {
    const response = await fetch(moduleSource.moduleJson);
    module = (await response.json()) as Module;
  }

  if ("rawRs2f" in moduleSource) {
    rs2f = moduleSource.rawRs2f;
  }

  if ("rs2f" in moduleSource) {
    const response = await fetch(moduleSource.rs2f);
    rs2f = await response.text();
  }

  if (!module || !rs2f) {
    throw new Error(`Module ${moduleSource.name} not found`);
  }

  return {
    name: moduleSource.name,
    moduleJson: module,
    rs2f: rs2f,
  };
};
