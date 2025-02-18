import {
  DeleteForever,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { groupBy } from "underscore";
import { ItemGroupMapping } from "../types/ItemGroupMapping";

interface ItemGroupMappingAccordionProps {
  mappings: ItemGroupMapping[];
  setMappings: Dispatch<SetStateAction<ItemGroupMapping[]>>;
  lootGroups: string[];
}

interface CreateMappingDialogProps {
  open: boolean;
  onClose: () => void;
  setMappings: Dispatch<SetStateAction<ItemGroupMapping[]>>;
  lootGroups: string[];
}

const CreateMappingDialog: React.FC<CreateMappingDialogProps> = ({
  open,
  onClose,
  setMappings,
  lootGroups,
}) => {
  const [itemExpr, setItemExpr] = useState("");
  const [groupName, setGroupName] = useState("");
  const [isUnique, setIsUnique] = useState(false);

  const handleCreate = () => {
    setMappings((prev) => [...prev, { itemExpr, groupName, isUnique: false }]);
    setItemExpr("");
    setGroupName("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Item Group Mapping</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Create a new mapping between an item expression and a group name.
        </DialogContentText>
        <FormControl fullWidth>
          <TextField
            autoFocus
            label="Item Expression"
            margin="dense"
            fullWidth
            value={itemExpr}
            onChange={(e) => setItemExpr(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel sx={{ marginTop: 1 }} id="group-name-label">
            Group Name
          </InputLabel>
          <Select
            labelId="group-name-label"
            variant="standard"
            fullWidth
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          >
            {lootGroups.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <FormControlLabel
            control={
              <Checkbox
                checked={isUnique}
                onChange={(e) => setIsUnique(e.target.checked)}
              />
            }
            label="Unique"
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export const ItemGroupMappingAccordion: React.FC<
  ItemGroupMappingAccordionProps
> = ({ mappings, setMappings, lootGroups }) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleDelete = (index: number) => {
    setMappings((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Item Group Mappings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CreateMappingDialog
            open={createDialogOpen}
            onClose={() => setCreateDialogOpen(false)}
            setMappings={setMappings}
            lootGroups={lootGroups}
          />
          <Button
            variant="contained"
            onClick={() => setCreateDialogOpen(true)}
            sx={{ mt: 2 }}
          >
            Add Mapping
          </Button>
          {Object.entries(groupBy(mappings, "groupName")).map(
            ([groupName, groupMappings]) => (
              <Box key={groupName} sx={{ mt: 2, mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  {groupName}
                </Typography>
                {groupMappings.map((mapping, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 1,
                      pl: 2,
                    }}
                  >
                    <Typography sx={{ flexGrow: 1 }}>
                      {mapping.itemExpr}
                      {mapping.isUnique && " (Unique)"}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(mappings.indexOf(mapping))}
                      aria-label="delete mapping"
                    >
                      <DeleteForever />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ),
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
