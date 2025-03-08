import { Editor } from "@monaco-editor/react";
import { Typography } from "@mui/material";
import {
  RenderFilterProvider,
  useRenderContext,
} from "../../context/RenderFilterContext";

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
              // TODO: render filter
              value={module.rs2fText}
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
      <Typography color="text.secondary">Copy and paste it for now.</Typography>
      <RenderFilterComponent />
    </RenderFilterProvider>
  );
};
