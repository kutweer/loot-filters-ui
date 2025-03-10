import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import {
  FilterSource,
  ModularFilterConfiguration,
  UiModularFilter,
} from "../types/ModularFilterSpec";

export const createLink = (
  filter: UiModularFilter,
  config: ModularFilterConfiguration | undefined
) => {
  const data = {
    filterSource: filter.source,
    config: config ?? {},
  };

  console.log("data", JSON.stringify(data));
  const component = compressToEncodedURIComponent(JSON.stringify(data));
  console.log(component);
  console.log(decompressFromEncodedURIComponent(component));

  return `${window.location.protocol}://${window.location.host}/import/${component}`;
};

export const parseComponent = (
  component: string
): {
  filterSource: FilterSource;
  config: ModularFilterConfiguration;
} => {
  const data = decompressFromEncodedURIComponent(component);
  console.log("data", data);
  const parsedData = JSON.parse(data);
  return parsedData;
};
