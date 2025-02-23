import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { isNumber } from "underscore";
import { LootGroup } from "../types/FilterTypes";
import { useState } from "react";

const EditLootGroupDialog: React.FC<{
  group: LootGroup;
  open: boolean;
  onClose: () => void;
  onChange: (group: LootGroup) => void;
}> = ({ group, open, onClose, onChange }) => {
  const [modalGroup, setModalGroup] = useState(group);

  const handleChange = (field: keyof LootGroup, value: any) => {
    setModalGroup({
      ...group,
      [field]: value,
    });
  };

  const save = () => {
    onChange(modalGroup);
    onClose();
  };

  return (
    <Dialog open={open} onClose={() => null} fullWidth>
      <DialogTitle>Edit Loot Group: {modalGroup.name}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          sx={{ marginTop: "8px" }}
          label="Group Name"
          value={modalGroup.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <TextField
          label="Value Threshold"
          value={modalGroup.valueThreshold}
          onChange={(e) =>
            handleChange(
              "valueThreshold",
              isNaN(Number(e.target.value))
                ? e.target.value
                : Number(e.target.value),
            )
          }
          error={!isNumber(modalGroup.valueThreshold)}
          helperText={
            !isNumber(modalGroup.valueThreshold)
              ? "Value threshold must be a number"
              : ""
          }
        />
        {/** TODO - other things configuration */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            sx={{ width: "40%" }}
            variant="contained"
            color="primary"
            onClick={() => save()}
          >
            Save
          </Button>
          <Button
            sx={{ width: "40%", marginLeft: "auto" }}
            variant="contained"
            color="error"
            onClick={() => onClose()}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export { EditLootGroupDialog };
