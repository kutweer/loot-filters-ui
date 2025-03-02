import { Container, Typography } from "@mui/material";
import { LootFilterUiData } from "../utils/dataStorage";



export const FilterSelector: React.FC<{
  lootFilterUiData: LootFilterUiData;
  setLootFilterUiData: (
    updater: (prev: LootFilterUiData) => LootFilterUiData
  ) => void;
}> = ({ lootFilterUiData, setLootFilterUiData }) => {
  return (
    <Container>
      <Typography sx={{ textAlign: "center" }} variant="h4" color="secondary">
        Filter Selector
      </Typography>
    </Container>
  );
};
