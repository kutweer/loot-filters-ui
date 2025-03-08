import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";
import { FilterModuleInput, filterTypes } from "../types/ModularFilterSpec";

type InputContextType = {
  input: FilterModuleInput<keyof typeof filterTypes>;
};

const InputContext = createContext<InputContextType | undefined>(undefined);

export const useInput = (): InputContextType => {
  const context = useContext(InputContext);
  if (context === undefined) {
    throw new Error("useInput must be used within an InputProvider");
  }
  return context;
};

interface InputProviderProps {
  children: ReactNode;
  input: FilterModuleInput<keyof typeof filterTypes>;
}

export const InputProvider = ({
  children,
  input,
}: InputProviderProps) => {
  return (
    <InputContext.Provider value={{ input }}>
      {children}
    </InputContext.Provider>
  );
};
