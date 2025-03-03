import {
  Box,
  Container,
  FormControl,
  MenuItem,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import {
    Filter,
  StoredData,
  StoredDataUpdater,
} from "../utils/dataStorage";

export const FilterSelector: React.FC<{
  activeFilter: Filter;
  storedData: StoredData;
  setStoredData: StoredDataUpdater;
}> = ({ activeFilter, storedData, setStoredData }) => {

  return (
    <Container>
      <Box sx={{ display: "flex" }}>
        <Typography sx={{ textAlign: "center" }} variant="h4" color="secondary">
          {activeFilter.name}
        </Typography>
        <FormControl sx={{ marginLeft: "auto" }}>
          <Select
            value={storedData.filters.findIndex((filter) => filter.name === activeFilter.name)}
            onChange={(e) => {
              setStoredData((prev) => ({
                ...prev,
                selectedFilterIndex: Number(e.target.value),
              }));
            }}
            renderValue={(value) => {
              return storedData.filters[value].name;
            }}
          >
            {storedData.filters.map((filter, index) => (
              <MenuItem key={filter.name} value={index}>
                {filter.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Container>
  );
};
