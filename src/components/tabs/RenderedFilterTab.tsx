import { Editor } from "@monaco-editor/react";
import { Typography } from "@mui/material";
import { useUiStore } from "../../store/store";
import {
  ModularFilterConfiguration,
  readConfigValue,
  readConfigValueIncludeExcludeList,
  UiFilterModule,
  UiModularFilter,
} from "../../types/ModularFilterSpec";
import { StyleConfig } from "../inputs/StyleInputHelprs";

const RenderFilterComponent: React.FC = () => {
  const activeFilter = useUiStore((state) =>
    Object.values(state.importedModularFilters).find((f) => f.active)
  );
  const activeConfig = useUiStore((state) =>
    activeFilter ? state.filterConfigurations[activeFilter.id] : undefined
  );

  return (
    <>
      <Typography color="text.secondary">Copy and paste it for now.</Typography>
      <Editor
        height="70vh"
        language="cpp"
        theme="vs-dark"
        options={{
          minimap: {
            enabled: false,
          },
          readOnly: true,
        }}
        value={
          activeFilter
            ? renderFilter(activeFilter, activeConfig)
            : "no filter selected"
        }
      />
    </>
  );
};

export const RenderedFilterTab: React.FC<{
  sha: string;
}> = ({ sha }) => {
  return <RenderFilterComponent />;
};

const renderFilter = (
  filter: UiModularFilter,
  activeConfig: ModularFilterConfiguration | undefined
): string => {
  return filter.modules
    .map((m) => {
      return activeConfig !== undefined
        ? renderModule(m, activeConfig)
        : m.rs2fText;
    })
    .join("\n");
};

const renderModule = (
  module: UiFilterModule,
  config: ModularFilterConfiguration
): string => {
  let updated = module.rs2fText;
  for (const input of module.inputs) {
    switch (input.type) {
      case "boolean":
        const bool = readConfigValue(input, config) ?? input.default;
        if (bool !== undefined) {
          updated = updateMacro(updated, input.macroName, bool.toString());
        }
        break;
      case "number":
        const value = readConfigValue(input, config) ?? input.default;
        if (value !== undefined) {
          updated = updateMacro(updated, input.macroName, value.toString());
        }
        break;
      case "stringlist":
      case "enumlist":
        const items = readConfigValue(input, config) ?? input.default;
        if (items !== undefined) {
          updated = updateMacro(
            updated,
            input.macroName,
            renderStringList(items)
          );
        }
        break;
      case "includeExcludeList":
        const includes =
          readConfigValueIncludeExcludeList(input, "includes", config) ??
          input.default.includes;
        const excludes =
          readConfigValueIncludeExcludeList(input, "excludes", config) ??
          input.default.excludes;
        if (includes !== undefined) {
          updated = updateMacro(
            updated,
            input.macroName.includes,
            renderStringList(includes)
          );
        }
        if (excludes !== undefined) {
          updated = updateMacro(
            updated,
            input.macroName.excludes,
            renderStringList(excludes)
          );
        }
        break;
      case "style":
        const style = config[input.macroName];
        if (style !== undefined) {
          updated = updateMacro(updated, input.macroName, renderStyle(style));
        }
        break;
    }
  }

  return updated;
};

const renderStringList = (list: string[]): string =>
  `[${list.map(quote).join(",")}]`;

const quote = (v: string): string => `"${v}"`;

const renderStyle = (style: StyleConfig): string => {
  return [
    renderStyleColor("textColor", style.textColor),
    renderStyleColor("backgroundColor", style.backgroundColor),
    renderStyleColor("borderColor", style.borderColor),
    renderStyleColor("textAccentColor", style.textAccentColor),
    renderStyleColor("lootbeamColor", style.lootbeamColor),
    renderStyleColor("menuTextColor", style.menuTextColor),
    renderStyleColor("tileStrokeColor", style.tileStrokeColor),
    renderStyleColor("tileHighlightColor", style.tileHighlightColor),
    renderStyleInt("textAccent", style.textAccent),
    renderStyleInt("fontType", style.fontType),
    renderStyleBool("showLootbeam", style.showLootbeam),
    renderStyleBool("showValue", style.showValue),
    renderStyleBool("showDespawn", style.showDespawn),
    renderStyleBool("notify", style.notify),
    renderStyleBool("hideOverlay", style.hideOverlay),
    renderStyleBool("highlightTile", style.highlightTile),
  ].join("");
};

const renderStyleColor = (name: string, color: string | undefined): string =>
  color !== undefined ? `${name} = "${color}";` : "";

const renderStyleInt = (name: string, int: number | undefined): string =>
  int !== undefined ? `${name} = ${int};` : "";

const renderStyleBool = (name: string, value: boolean | undefined): string =>
  value !== undefined ? `${name} = ${value};` : "";

const isTargetMacro = (line: string, target: string): boolean =>
  line.startsWith(`#define ${target} `) || line === `#define ${target}`;

const updateMacro = (
  filter: string,
  macro: string,
  replace: string
): string => {
  return filter
    .split("\n")
    .map((line) =>
      isTargetMacro(line, macro) ? "#define " + macro + " " + replace : line
    )
    .join("\n");
};
