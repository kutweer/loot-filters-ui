import { Stack } from "@mui/material";
import React from "react";
import { LootGroup } from "../types/FilterTypes";
import { CreateGroupComponent } from "./CreateGroupComponent";
import { LootGroupComponent } from "./LootGroup";

export const LootGroupList: React.FC<{
  groups: LootGroup[];
  handleGroupUpdate: (groups: LootGroup[]) => void;
  handleCreateGroup: (group: LootGroup) => void;
}> = ({ groups, handleGroupUpdate, handleCreateGroup }) => {
  return (
    <Stack direction="column" spacing={2}>
      <CreateGroupComponent onCreateGroup={handleCreateGroup} />
      {groups.map((group, index) => (
        <LootGroupComponent
          key={index}
          index={index}
          group={group}
          onChange={(updatedGroup: LootGroup) => {
            const newGroups = [...groups];
            newGroups[index] = updatedGroup;
            handleGroupUpdate(newGroups);
          }}
          handleSortChange={(event, newIndex) => {
            const newGroups = [...groups];
            const removed = newGroups.splice(index, 1)[0];
            if (event.ctrlKey || event.metaKey) {
              const pos = newIndex < index ? 0 : newGroups.length;
              newGroups.splice(pos, 0, removed);
            } else if (event.shiftKey) {
              const pos = newIndex < index ? index - 5 : index + 5;
              newGroups.splice(pos, 0, removed);
            } else {
              newGroups.splice(newIndex, 0, removed);
            }
            handleGroupUpdate(newGroups);
          }}
        />
      ))}
    </Stack>
  );
};
