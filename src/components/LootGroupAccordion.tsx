import { DeleteForever } from "@mui/icons-material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import { LootGroup } from "../templating/filterscape";
import { HexColor } from "../templating/hexcolor";
interface LootGroupAccordionProps {
  groups: LootGroup[];
  setGroups: Dispatch<SetStateAction<LootGroup[]>>;
}

interface CreateLootGroupDialogProps {
  open: boolean;
  onClose: () => void;
  setGroups: Dispatch<SetStateAction<LootGroup[]>>;
}

const ColorSwatch = ({
  color,
  onChange,
}: {
  color: HexColor;
  onChange?: (color: HexColor) => void;
}) => (
  <Box
    component="span"
    sx={{
      display: "inline-block",
      width: 24,
      height: 24,
      borderRadius: "50%",
      backgroundColor: `rgba(${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${parseInt(color.slice(7, 9), 16)}, ${parseInt(color.slice(1, 3), 16)})`,
      border: "1px solid rgba(0, 0, 0, 0.23)",
      marginRight: 1,
      verticalAlign: "middle",
    }}
  >
    {/* total hack to get a circle that adopts the chosen color */}
    {onChange ? (
      <input
        type="color"
        value={color ? (color.length == 9 ? `#${color.slice(2)}` : color) : ""}
        onChange={(e) => onChange(e.target.value as HexColor)}
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          display: "block",
          opacity: 0,
        }}
      />
    ) : null}
  </Box>
);

const ColorButton = ({
  color,
  onChange,
  label,
}: {
  color: HexColor;
  onChange: (color: HexColor) => void;
  label: string;
}) => (
  <Box sx={{ position: "relative" }}>
    <ColorSwatch onChange={onChange} color={color} />
    <Typography component="span">{label}</Typography>
  </Box>
);

const CreateLootGroupDialog: React.FC<CreateLootGroupDialogProps> = ({
  open,
  onClose,
  setGroups,
}) => {
  const [name, setName] = useState<string | null>(null);
  const [foregroundColor, setForegroundColor] = useState<HexColor>("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState<HexColor>("#000000");
  const [borderColor, setBorderColor] = useState<HexColor>("#ffffff");
  const [beam, setBeam] = useState<boolean>(true);

  const create = () => {
    setGroups((prevGroups: LootGroup[]) => {
      const group = {
        name: name as string,
        foregroundColor,
        backgroundColor,
        borderColor,
        beam,
        valueThreshold: 10_000_000,
      };
      return [...(prevGroups || []), group];
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Loot Group</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Configure a new loot group to add to your filter.
        </DialogContentText>
        <TextField
          slotProps={{ htmlInput: { "data-op-ignore": "true" } }}
          autoFocus
          margin="dense"
          id="name"
          label="Group Name"
          type="text"
          fullWidth
          variant="standard"
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
          helperText={name ? null : "Group name is required"}
          error={!name}
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <ColorButton
            color={foregroundColor}
            onChange={setForegroundColor}
            label="Foreground Color"
          />
          <ColorButton
            color={backgroundColor}
            onChange={setBackgroundColor}
            label="Background Color"
          />
          <ColorButton
            color={borderColor}
            onChange={setBorderColor}
            label="Border Color"
          />
          <ToggleButton
            value="check"
            selected={beam}
            onChange={() => setBeam((prevSelected) => !prevSelected)}
          >
            <AutoAwesomeIcon />
          </ToggleButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={!name} onClick={create}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

type LootGroupProps = LootGroup & {
  index: number;
  groups: LootGroup[];
  inner: boolean;
  setGroups: Dispatch<SetStateAction<LootGroup[]>>;
};
const LootGroupItem: React.FC<LootGroupProps> = ({
  index,
  name,
  foregroundColor,
  backgroundColor,
  borderColor,
  beam,
  valueThreshold,
  uniqueOverrides,
  groups,
  setGroups,
  inner = false,
}) => {
  return (
    <Card variant="outlined" sx={{ border: inner ? "none" : null }}>
      <CardHeader
        title={
          <Box>
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Typography>{name}</Typography>
              <Typography>Foreground</Typography>
              <ColorSwatch color={foregroundColor} />
              <Typography>Background</Typography>
              <ColorSwatch color={backgroundColor} />
              <Typography>Border</Typography>
              <ColorSwatch color={borderColor} />
              <Typography>Beam:</Typography>
              {beam ? <AutoAwesomeIcon /> : <NotInterestedIcon />}

              <Typography>Value Tier:</Typography>
              <Typography>{valueThreshold.toLocaleString()}</Typography>
              {!inner ? (
                <IconButton
                  sx={{ marginLeft: "auto" }}
                  onClick={() => {
                    setGroups(groups.filter((_, i) => i !== index));
                  }}
                >
                  <DeleteForever />
                </IconButton>
              ) : null}
            </Box>
            {!inner && uniqueOverrides ? (
              <LootGroupItem
                index={index}
                groups={groups}
                setGroups={setGroups}
                inner={true}
                {...groups.filter((_, i) => i === index)[0]}
                {...uniqueOverrides}
                name={`unique settings`}
              />
            ) : null}
          </Box>
        }
      />
    </Card>
  );
};

export const LootGroupAccordion: React.FC<LootGroupAccordionProps> = ({
  groups,
  setGroups,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Loot Groups</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{ mb: 2 }}
          >
            Add Loot Group
          </Button>
          {open ? (
            <CreateLootGroupDialog
              open={open}
              onClose={() => setOpen(false)}
              setGroups={setGroups}
            />
          ) : null}
          {groups?.map((group, index) => (
            <LootGroupItem
              inner={false}
              key={index}
              index={index}
              groups={groups}
              setGroups={setGroups}
              {...group}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
