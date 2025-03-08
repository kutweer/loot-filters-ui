import {
  FilterSource,
  ModuleSource,
  UiFilterModule,
  UiModularFilter,
} from "../types/ModularFilter";
import {
  FilterModule,
  validateFilterModuleInput,
  validateModule,
} from "../types/ModularFilterSpec";

type FilterDefinition = {
  name: string;
  description: string;
  modules: (ModuleSource | FilterModule)[];
};

export const loadFilter = async (
  source: FilterSource | UiModularFilter
): Promise<UiModularFilter> => {
  let filter: FilterDefinition;

  if ("filterUrl" in source && source.filterUrl) {
    const response = await fetch(source.filterUrl);
    filter = (await response.json()) as FilterDefinition;
  } else {
    // even if the source is a ModularFilter, some modules may not be loaded
    filter = source as FilterDefinition;
  }

  validateFilterModuleInput({ ...filter, modules: [] }, false);

  const resolvedModules: UiFilterModule[] = await Promise.all(
    filter.modules.map(
      async (
        moduleSource: ModuleSource | FilterModule
      ): Promise<UiFilterModule> => {
        if (
          "moduleJson" in moduleSource &&
          moduleSource.moduleJson &&
          "moduleRs2fText" in moduleSource &&
          typeof moduleSource.moduleRs2fText === "string"
        ) {
          const module = {
            ...moduleSource.moduleJson,
            rs2fText: moduleSource.moduleRs2fText,
            source: moduleSource,
          };

          validateModule(module);
          return module;
        } else if (
          "moduleJsonUrl" in moduleSource &&
          moduleSource.moduleJsonUrl &&
          "moduleRs2fUrl" in moduleSource &&
          moduleSource.moduleRs2fUrl
        ) {
          const moduleJsonResponse = await fetch(moduleSource.moduleJsonUrl);
          const moduleJson = (await moduleJsonResponse.json()) as FilterModule;

          const moduleRs2fResponse = await fetch(moduleSource.moduleRs2fUrl);
          const moduleRs2fText = await moduleRs2fResponse.text();

          const module = {
            ...moduleJson,
            rs2fText: moduleRs2fText,
            source: moduleSource,
          };

          validateModule(module);
          return module;
        } else {
          throw new Error(
            `Invalid module source '${JSON.stringify(moduleSource)}', no moduleJson or moduleJsonUrl`
          );
        }
      }
    )
  );

  return {
    name: filter.name,
    source: "filterUrl" in source && source.filterUrl ? source : undefined,
    id: crypto.randomUUID(),
    description: filter.description,
    modules: resolvedModules,
    importedOn: new Date().toISOString(),
  };
};
