import { Editor } from "@monaco-editor/react";
import { Typography } from "@mui/material";
import { useUiStore } from "../../store/store";
import { Input, InputDefault, MacroName } from "../../types/InputsSpec";
import {
  ModularFilterConfiguration,
  UiFilterModule,
  UiModularFilter,
} from "../../types/ModularFilterSpec";
import { StyleConfig } from "../inputs/StyleInputHelpers";

const RenderFilterComponent: React.FC = () => {
  const activeFilter = useUiStore((state) =>
    Object.values(state.importedModularFilters).find((f) => f.active),
  );
  const activeConfig = useUiStore((state) =>
    activeFilter ? state.filterConfigurations[activeFilter.id] : undefined,
  );

  return (
    <>
      <Typography color="text.secondary">
        Copy and paste into a file named{" "}
        <span
          style={{
            color: "white",
            fontSize: "16px",
          }}
        >
          {activeFilter?.name.replace(/\s/g, "_")}.rs2f
        </span>{" "}
        in{" "}
        <span style={{ color: "white", fontSize: "16px" }}>
          .runelite/loot-filters/filters
        </span>
        .
      </Typography>

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
  activeConfig: ModularFilterConfiguration | undefined,
): string => {
  return filter.modules
    .map((m) => renderModule(m, activeConfig?.[m.id]))
    .join("\n");
};

const renderModule = (
  module: UiFilterModule,
  config: { [key: MacroName]: Partial<InputDefault<Input>> } | undefined,
): string => {
  let updated = module.rs2fText;

  for (const input of module.inputs) {
    switch (input.type) {
      case "boolean":
        const bool = config?.[input.macroName] ?? input.default;
        if (bool !== undefined) {
          updated = updateMacro(updated, input.macroName, bool.toString());
        }
        break;
      case "number":
        const value = config?.[input.macroName] ?? input.default;
        if (value !== undefined) {
          updated = updateMacro(updated, input.macroName, value.toString());
        }
        break;
      case "stringlist":
      case "enumlist":
        const items = (config?.[input.macroName] ?? input.default) as string[];
        if (items !== undefined) {
          updated = updateMacro(
            updated,
            input.macroName,
            renderStringList(items),
          );
        }
        break;
      case "includeExcludeList":
        const includes = (config?.[input.macroName.includes] ??
          input.default.includes) as string[];
        const excludes = (config?.[input.macroName.excludes] ??
          input.default.excludes) as string[];
        if (includes !== undefined) {
          updated = updateMacro(
            updated,
            input.macroName.includes,
            renderStringList(includes),
          );
        }
        if (excludes !== undefined) {
          updated = updateMacro(
            updated,
            input.macroName.excludes,
            renderStringList(excludes),
          );
        }
        break;
      case "style":
        const style = config?.[input.macroName] as StyleConfig | undefined;
        const defaultStyle = input.default as StyleConfig;
        const mergedStyle = { ...(defaultStyle ?? {}), ...(style ?? {}) };
        if (Object.keys(mergedStyle).length > 0) {
          updated = updateMacro(
            updated,
            input.macroName,
            renderStyle(mergedStyle as StyleConfig),
          );
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
  replace: string,
): string => {
  return filter
    .split("\n")
    .map((line) =>
      isTargetMacro(line, macro) ? "#define " + macro + " " + replace : line,
    )
    .join("\n");
};
