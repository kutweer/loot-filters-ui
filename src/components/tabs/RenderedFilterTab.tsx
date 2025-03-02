import { Editor } from "@monaco-editor/react";
import { Typography } from "@mui/material";

export const RenderedFilterTab: React.FC<{
  sha: string;
}> = ({ sha }) => {
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
        // TODO: render filter
        value={sha}
      />
    </>
  );
};
