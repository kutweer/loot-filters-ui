import {
    Box,
    Button,
    Paper,
    TextField
} from "@mui/material";
import React, { useState } from "react";
import { LootGroup } from "../types/FilterTypes";
import { ArgbHexColor } from "../types/hexcolor";
import { ColorPickerInput } from "./ColorPicker";
import { ExampleItemLabel } from "./ExampleItemLabel";

interface CreateGroupComponentProps {
    onCreateGroup: (group: LootGroup) => void;
}

export const CreateGroupComponent: React.FC<CreateGroupComponentProps> = ({
    onCreateGroup,
}) => {
    const defaultState = {
        name: "",
        foregroundColor: "#FFFFFFFF" as ArgbHexColor,
        backgroundColor: "#FFFF22DD" as ArgbHexColor,
        borderColor: "#FFFFDD22" as ArgbHexColor,
        beam: false,
        items: [],
    }
    const [newGroup, setNewGroup] = useState<LootGroup>(defaultState);

    const handleChange = (field: keyof LootGroup, value: any) => {
        setNewGroup({
            ...newGroup,
            [field]: value,
        });
    };

    const handleSubmit = () => {
        if (newGroup.name.trim() === "") {
            return; // Don't create group without a name
        }
        onCreateGroup(newGroup);
        // Reset form
        setNewGroup(defaultState);
    };

    return (
        <Paper>
            <Box
                sx={{
                    padding: 2,
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                }}
            >
                <TextField
                    label="Group Name"
                    value={newGroup.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    size="small"
                />
                <ColorPickerInput
                    color={newGroup.foregroundColor}
                    labelText="Text Color"
                    onChange={(color: ArgbHexColor) =>
                        handleChange("foregroundColor", color)
                    }
                />
                <ColorPickerInput
                    color={newGroup.backgroundColor}
                    labelText="Background"
                    onChange={(color: ArgbHexColor) =>
                        handleChange("backgroundColor", color)
                    }
                />
                <ColorPickerInput
                    color={newGroup.borderColor}
                    labelText="Border"
                    onChange={(color: ArgbHexColor) =>
                        handleChange("borderColor", color)
                    }
                />
                <Box sx={{ border: "3px solid black", backgroundColor: "#dddddd" }}>
                    <ExampleItemLabel
                        itemName={newGroup.name || "Example"}
                        foregroundColor={newGroup.foregroundColor}
                        backgroundColor={newGroup.backgroundColor}
                        borderColor={newGroup.borderColor}
                    />
                </Box>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={newGroup.name.trim() === ""}
                    sx={{ marginLeft: "auto" }}
                >
                    Create Group
                </Button>
            </Box>
        </Paper>
    );
};
