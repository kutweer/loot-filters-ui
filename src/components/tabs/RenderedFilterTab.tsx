import { Editor } from "@monaco-editor/react";
import { Typography } from "@mui/material";
import {
  RenderFilterProvider,
  useRenderContext,
} from "../../context/RenderFilterContext";
import { ModularFilterConfiguration } from "../../utils/storage";
import { StyleConfig } from "../inputs/StyleInputHelprs";
import { UiFilterModule, UiModularFilter } from "../../types/ModularFilter";
import {
  filterTypes,
  isBoolean,
  isNumber,
  isStringList,
  isEnumList,
  isIncludeExcludeList,
  isStyle,
} from "../../types/ModularFilterSpec";

const RenderFilterComponent: React.FC = () => {
  const { activeFilter, activeConfig } = useRenderContext();

  return (
    <>
      <Typography color="text.secondary">Copy and paste it for now.</Typography>
      {activeFilter?.modules.map((module) => {
        return (
          <div key={module.name}>
            {module.name}
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
              value={renderFilter(activeFilter, activeConfig)}
            />
          </div>
        );
      })}
    </>
  );
};

export const RenderedFilterTab: React.FC<{
  sha: string;
}> = ({ sha }) => {
  return (
    <RenderFilterProvider>
      <RenderFilterComponent />
    </RenderFilterProvider>
  );
};

const renderFilter = (
  filter: UiModularFilter,
  activeConfig: ModularFilterConfiguration<keyof typeof filterTypes> | undefined,
): string => {
  return filter.modules.map(m => {
    return activeConfig !== undefined
      ? renderModule(m, activeConfig)
      : m.rs2fText;
  }).join('\n');
}

const renderModule = (
  module: UiFilterModule,
  config: ModularFilterConfiguration<keyof typeof filterTypes>,
): string => {
  let updated = module.rs2fText;
  for (const input of module.inputs) {
    if (isBoolean(input)) {
      const bool = config[input.macroName];
      if (bool !== undefined) {
        updated = updateMacro(updated, input.macroName, bool.toString());
      }
    } else if (isNumber(input)) {
      const value = config[input.macroName];
      if (value !== undefined) {
        updated = updateMacro(updated, input.macroName, value.toString());
      }
    } else if (isStringList(input) || isEnumList(input)) {
      const items = config[input.macroName];
      if (items !== undefined) {
        updated = updateMacro(updated, input.macroName, renderStringList(items));
      }
    } else if (isIncludeExcludeList(input)) {
      const includes = config[input.macroName.includes];
      const excludes = config[input.macroName.excludes];
      if (includes !== undefined) {
        updated = updateMacro(updated, input.macroName.includes, renderStringList(includes));
      }
      if (excludes !== undefined) {
        updated = updateMacro(updated, input.macroName.excludes, renderStringList(excludes));
      }
    } else if (isStyle(input)) {
      const style = config[input.macroName];
      if (style !== undefined) {
        updated = updateMacro(updated, input.macroName, renderStyle(style));
      }
    }
  }

  return updated;
}

const renderStringList = (list: string[]): string => `[${list.map(quote).join(",")}]`;

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

const updateMacro = (filter: string, macro: string, replace: string): string => {
  return filter.split('\n')
    .map(line => isTargetMacro(line, macro) ? "#define " + macro + " " + replace : line)
    .join('\n');
}
