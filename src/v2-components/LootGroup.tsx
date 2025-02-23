import { Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { LootGroup } from "../types/FilterTypes";
import { ArgbHexColor } from "../types/hexcolor";
import { ColorPickerInput } from "./ColorPicker";
import { EditLootGroupDialog } from "./EditLootGroupDialog";
import { ExampleItemLabel } from "./ExampleItemLabel";

interface LootGroupProps {
  group: LootGroup;
  onChange: any;
}

export const LootGroupComponent: React.FC<LootGroupProps> = ({
  group,
  onChange,
}) => {
  const handleChange = (field: keyof LootGroup, value: any) => {
    console.log("handleChange", group.name, field, value);
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
          padding: 2,
          display: "flex",
          gap: 2,
          width: "-webkit-fill-available",
        }}
      >
        <Typography sx={{ textAlign: "center" }} width="15%" variant="h6">
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
        <Box sx={{ border: "3px solid black", backgroundColor: "#dddddd" }}>
          <ExampleItemLabel
            itemName={group.name}
            foregroundColor={group.foregroundColor}
            backgroundColor={group.backgroundColor}
            borderColor={group.borderColor}
          />
        </Box>
        <Box>
          <FormControl>
            <ToggleButtonGroup
              exclusive={true}
              orientation="vertical"
              value={group.beam ? "beam" : "no-beam"}
              size="small"
              onChange={(_, newValue) => {
                handleChange("beam", newValue === "beam");
              }}
            >
              <ToggleButton
                sx={{ fontSize: "12px", padding: "4px" }}
                value="beam"
              >
                Loot Beam
              </ToggleButton>
              <ToggleButton
                sx={{ fontSize: "12px", padding: "4px" }}
                value="no-beam"
              >
                No Loot Beam
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </Box>
        <Box sx={{ marginLeft: "auto" }}>
          <Button
            variant="outlined"
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            <Edit /> Default Settings
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
          {/* TODO - dragable <DragIndicator /> */}
        </Box>
      </Box>
    </Paper>
  );
};
