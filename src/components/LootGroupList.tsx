import { Stack, Typography } from "@mui/material";
import React from "react";
import { FilterConfig, LootGroup } from "../types/FilterTypes";
import { CreateGroupComponent } from "./CreateGroupComponent";
import { LootGroupComponent } from "./LootGroup";

export const LootGroupList: React.FC<{
  groups: LootGroup[];
  handleGroupUpdate: (updater: (config: FilterConfig) => FilterConfig) => void;
  handleCreateGroup: (group: LootGroup) => void;
}> = ({ groups, handleGroupUpdate, handleCreateGroup }) => {
  return (
    <Stack direction="column" spacing={2}>
      <CreateGroupComponent onCreateGroup={handleCreateGroup} />
      {groups.length === 0 && (
        <Typography sx={{ textAlign: "center" }} variant="h4" color="text.secondary">Create a group to get started</Typography>
      )}
      {groups.map((group, index) => (
        <LootGroupComponent
          key={index}
          index={index}
          groupsLength={groups.length}
          group={group}
          onChange={(updatedGroup: LootGroup) => {
            handleGroupUpdate((prev: FilterConfig) => {
              const newGroups = [...prev.lootGroups];
              newGroups[index] = updatedGroup;
              return { ...prev, lootGroups: newGroups };
            });
          }}
          handleSortChange={(event, direction) => {
            const key =
              event.ctrlKey || event.metaKey
                ? "ctrl"
                : event.shiftKey
                  ? "shift"
                  : "none";

            let newIndex = index;

            if (direction === "up") {
              if (key === "ctrl") {
                newIndex = 0;
              } else if (key === "shift") {
                newIndex = index - 5;
              } else {
                newIndex = index - 1;
              }
            } else if (direction === "down") {
              if (key === "ctrl") {
                newIndex = groups.length - 1;
              } else if (key === "shift") {
                newIndex = index + 5;
              } else {
                newIndex = index + 1;
              }
            }

            handleGroupUpdate((prev: FilterConfig) => {
              const newGroups = [...prev.lootGroups];
              const removed = newGroups.splice(index, 1)[0];
              newGroups.splice(newIndex, 0, removed);
              return { ...prev, lootGroups: newGroups };
            });
          }}
        />
      ))}
    </Stack>
  );
};
