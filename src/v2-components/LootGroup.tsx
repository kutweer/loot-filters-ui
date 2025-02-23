import { Delete, Edit, ExpandMore, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    FormControl,
    IconButton,
    Paper,
    TextField,
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

interface LootGroupProps {
    index: number;
    group: LootGroup;
    onChange: any;
    handleSortChange: (event: React.MouseEvent<HTMLElement>, newIndex: number) => void;
}

export const LootGroupComponent: React.FC<LootGroupProps> = ({
    index,
    group,
    onChange,
    handleSortChange,
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
                        onClick={() => { setOpenDialog(true); }}
                    >
                        <Edit /> Settings
                    </Button>
                </Box>
                <Box>
                    <EditLootGroupDialog
                        open={openDialog}
                        group={group}
                        onChange={(group: LootGroup) => { onChange(group); }}
                        onClose={() => { setOpenDialog(false); }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <ToggleButtonGroup
                            orientation="vertical"
                            size="small"
                        >
                            <Tooltip title="Move up; Ctrl/Cmd + click to move to top; Shift + click to move up 5">
                                <ToggleButton
                                    value='up'
                                    onClick={(e) => { handleSortChange(e, Math.min(index - 1, 0)); }}
                                    disabled={index === 0}
                                >
                                    <KeyboardArrowUp fontSize="small" />
                                </ToggleButton>
                            </Tooltip>
                            <Tooltip title="Move down; Ctrl/Cmd + click to move to bottom; Shift + click to move down 5">
                                <ToggleButton
                                    value="down"
                                    onClick={(e) => { handleSortChange(e, index + 1); }}
                                    disabled={!group.items || index === group.items.length - 1}
                                >
                                    <KeyboardArrowDown fontSize="small" />
                                </ToggleButton>
                            </Tooltip>
                        </ToggleButtonGroup>
                    </Box>
                </Box>
            </Box>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>Manually Mapped Items ({group.items?.length || 0})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {group.items?.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography>{item.name}</Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        const newItems = [...(group.items || [])];
                                        newItems.splice(index, 1);
                                        handleChange('items', newItems);
                                    }}
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                                size="small"
                                placeholder="Add item..."
                                onChange={(e) => {
                                    handleChange('items',
                                        [...(group.items || []),
                                        e.target.value]);
                                }}
                            />
                        </Box>

                    </Box>
                </AccordionDetails>
            </Accordion>

        </Paper>
    );
};
