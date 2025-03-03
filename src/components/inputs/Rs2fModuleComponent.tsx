import {
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { Rs2fModule, Rs2fModuleInput } from "../../types/Rs2fModule";
import { DisplayConfigurationInput } from "./DisplayConfigurationInput";

const getInputComponent = (
  input: Rs2fModuleInput,
  onChange: (input: Rs2fModuleInput) => void
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
  input: Rs2fModuleInput;
  onChange: (input: Rs2fModuleInput) => void;
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
  module: Rs2fModule;
  onChange: (module: Rs2fModule) => void;
}> = ({ module, onChange }) => {
  return (
    <Box>
      <Typography variant="h4" color="secondary">
        {module.name}
      </Typography>
      <Stack spacing={2} direction="column">
        {module.input.map((input) => (
          <Rs2fInputComponent
            key={input.name}
            input={input}
            onChange={(input) =>
              onChange({
                ...module,
                input: module.input.map((i) => i.name === input.name ? input : i),
              })
            }
          />
        ))}
      </Stack>
    </Box>
  );
};
