import { createContext, ReactNode, useContext, useMemo } from "react";
import { UiModularFilter } from "../types/ModularFilter";
import { filterTypes } from "../types/ModularFilterSpec";
import { loadData, ModularFilterConfiguration, UiData } from "../utils/storage";
import { useData } from "./UiDataContext";
import { Typography } from "@mui/material";

type RenderFilterContextType = {
  activeFilter: UiModularFilter | undefined;
  activeConfig:
    | ModularFilterConfiguration<keyof typeof filterTypes>
    | undefined;
};

const RenderFilterContext = createContext<RenderFilterContextType | undefined>(
  undefined
);

export const useRenderContext = (): RenderFilterContextType => {
  const context = useContext(RenderFilterContext);
  if (context === undefined) {
    throw new Error(
      "useRenderFilter must be used within a RenderFilterProvider"
    );
  }
  return context;
};

interface RenderFilterProviderProps {
  children: ReactNode;
}

export const RenderFilterProvider = ({
  children,
}: RenderFilterProviderProps) => {
  const { activeFilterId, getActiveFilter } = useData();

  const activeFilter = useMemo(() => {
    return getActiveFilter();
  }, [activeFilterId, getActiveFilter]);

  if (!activeFilter) {
    return <Typography color="text.secondary">No filter selected</Typography>;
  }

  const activeConfig: ModularFilterConfiguration<keyof typeof filterTypes> =
    loadData("ui-data", (uiData: UiData) => {
      return uiData.filterConfigurations[activeFilter?.id];
    }) ?? {};

  const contextValue = {
    activeFilter,
    activeConfig,
  };

  return (
    <RenderFilterContext.Provider value={contextValue}>
      {children}
    </RenderFilterContext.Provider>
  );
};
