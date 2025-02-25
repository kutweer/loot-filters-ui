import { Delete, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { colors } from "../styles/MuiTheme";
import { ItemConfig, LootGroup } from "../types/FilterTypes";

export const MappedItemAccordion: React.FC<{
  items: ItemConfig[];
  handleChange: (updater: (lootGroup: LootGroup) => LootGroup) => void;
}> = ({ items, handleChange }) => {
  const [newItem, setNewItem] = useState("");

  return (
    <Accordion
      sx={{
        margin: 1,
        "&.MuiAccordion-root:before": {
          backgroundColor: colors.rsLightDarkBrown,
        },
        "&.MuiAccordion-root": {
          backgroundColor: colors.rsLightBrown,
          border: "2px solid black",
          borderRadius: "5px",
          margin: 1,
          marginBottom: 0,
        },
        "&.Mui-expanded": {
          backgroundColor: colors.rsLightBrown,
        },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>Manually Mapped Items ({items?.length || 0})</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Add item..."
            onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewItem(e.target.value);
            }}
            value={newItem}
          />
          <Button
            variant="outlined"
            onClick={() => {
              handleChange((prev) => {
                const updated = {
                  ...prev,
                  items: [...(prev.items || []), { name: newItem }],
                };
                setNewItem("");
                return updated;
              });
            }}
          >
            Add
          </Button>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            width: "100%",
            marginTop: 1,
          }}
        >
          {items?.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 0, // Prevents overflow
              }}
            >
              <Typography noWrap>{item.name}</Typography>
              <IconButton
                size="small"
                onClick={() => {
                  handleChange((prev) => {
                    const newItems = [...(prev.items || [])];
                    newItems.splice(index, 1);
                    return { ...prev, items: newItems };
                  });
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
