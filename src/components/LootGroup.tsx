import { Edit, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Paper,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { LootGroup } from "../types/FilterTypes";
import { ArgbHexColor } from "../types/hexcolor";
import { ColorPickerInput } from "./ColorPicker";
import { EditLootGroupDialog } from "./EditLootGroupDialog";
import { ExampleItemLabel } from "./ExampleItemLabel";
import { MappedItemAccordion } from "./MappedItemAccordion";

interface LootGroupProps {
  index: number;
  group: LootGroup;
  groupsLength: number;
  onChange: any;
  handleSortChange: (
    event: React.MouseEvent<HTMLElement>,
    direction: "up" | "down"
  ) => void;
}

export const LootGroupComponent: React.FC<LootGroupProps> = ({
  index,
  groupsLength,
  group,
  onChange,
  handleSortChange,
}) => {
  const handleChange = (field: keyof LootGroup, value: any) => {
    onChange({
      ...group,
      [field]: value,
    });
  };

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  return (
    <Paper>
      <Box
        sx={{
          padding: 1,
          display: "flex",
          gap: 3,
          width: "-webkit-fill-available",
        }}
      >
        <Typography
          sx={{ marginTop: "auto", marginBottom: "auto", textAlign: "center" }}
          width="15%"
          variant="h6"
        >
          {group.name}
        </Typography>
        <ColorPickerInput
          color={group.foregroundColor}
          labelText="Text Color"
          onChange={(color: ArgbHexColor) =>
            handleChange("foregroundColor", color)
          }
        />
        <ColorPickerInput
          color={group.backgroundColor}
          labelText="Background"
          onChange={(color: ArgbHexColor) =>
            handleChange("backgroundColor", color)
          }
        />
        <ColorPickerInput
          color={group.borderColor}
          labelText="Border"
          onChange={(color: ArgbHexColor) => handleChange("borderColor", color)}
        />
        <FormControl sx={{ marginTop: "auto", marginBottom: "auto" }}>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={group.beam} />}
              onChange={(_, checked: boolean) => handleChange("beam", checked)}
              label="Loot Beam"
            />
          </FormGroup>
        </FormControl>
        <Box
          sx={{
            border: "3px solid black",
            backgroundColor: "#dddddd",
            marginTop: "5px",
            height: "80%",
          }}
        >
          <ExampleItemLabel
            itemName={group.name}
            foregroundColor={group.foregroundColor}
            backgroundColor={group.backgroundColor}
            borderColor={group.borderColor}
          />
        </Box>
        <Button
          sx={{ marginTop: "auto", marginBottom: "auto", marginLeft: "auto" }}
          size="small"
          variant="outlined"
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          <Edit /> Settings
        </Button>
        <EditLootGroupDialog
          open={openDialog}
          group={group}
          onChange={(group: LootGroup) => {
            onChange(group);
          }}
          onClose={() => {
            setOpenDialog(false);
          }}
        />
        <ToggleButtonGroup orientation="vertical" size="small">
          <Tooltip title="Move up; Ctrl/Cmd + click to move to top; Shift + click to move up 5">
            <ToggleButton
              value="up"
              onClick={(e) => {
                handleSortChange(e, "up");
              }}
              disabled={index === 0}
            >
              <KeyboardArrowUp fontSize="small" />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Move down; Ctrl/Cmd + click to move to bottom; Shift + click to move down 5">
            <ToggleButton
              value="down"
              onClick={(e) => {
                handleSortChange(e, "down");
              }}
              disabled={index === groupsLength - 1}
            >
              <KeyboardArrowDown fontSize="small" />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ paddingBottom: 1 }}>
        <MappedItemAccordion
          items={group.items || []}
          handleChange={(updater) => {
            onChange(updater(group));
          }}
        />
      </Box>
    </Paper>
  );
};
