import { Box, Stack, Typography } from "@mui/material";
import { Module, ModuleInput } from "../../types/FilterModule";
import { DisplayConfigurationInput } from "./DisplayConfigurationInput";

const getInputComponent = (
  input: ModuleInput,
  onChange: (input: ModuleInput) => void
): React.ReactNode => {
  switch (input.type) {
    case "itemlist":
      return <span> Item List </span>;
    case "style":
      return <DisplayConfigurationInput input={input} onChange={onChange} />;
    default:
      return null;
  }
};

const Rs2fInputComponent: React.FC<{
  input: ModuleInput;
  onChange: (input: ModuleInput) => void;
}> = ({ input, onChange }) => {
  const component = getInputComponent(input, onChange);

  return (
    <Box>
      <Typography variant="h4" color="secondary">
        {input.label}
      </Typography>
      {component}
    </Box>
  );
};

export const Rs2fModuleComponent: React.FC<{
  module: Module;
  onChange: (module: Module) => void;
}> = ({ module, onChange }) => {
  return (
    <Box>
      <Typography variant="h4" color="secondary">
        {module.name}
      </Typography>
      <Stack spacing={2} direction="column">
        {module.input.map((input, index) => (
          <Rs2fInputComponent
            key={index}
            input={input}
            onChange={(input) =>
              onChange({
                ...module,
                input: module.input.map((i) =>
                  i.name === input.name ? input : i
                ),
              })
            }
          />
        ))}
      </Stack>
    </Box>
  );
};
