import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";

export const LootBeamSwitch: React.FC<{
  beam: boolean;
  onChange: (beam: boolean) => void;
}> = ({ beam, onChange }) => {
  return (
    <FormControl sx={{ marginTop: "auto", marginBottom: "auto" }}>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={beam} />}
          onChange={(_, checked: boolean) => onChange(checked)}
          label={`Loot Beam ${beam ? "Enabled" : "Disabled"}`}
        />
      </FormGroup>
    </FormControl>
  );
};
