import { Box, Container, Divider, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { ArgbHexColor } from "../../types/Color";
import {
  BooleanRule,
  ItemIdRule,
  ItemNameRule,
  ItemNotedRule,
  ItemStackableRule,
  ItemTradeableRule,
  ItemValueRule,
} from "../../types/FilterTypes2";
import { ColorPickerInput } from "../inputs/ColorPicker";
import { ItemLabelColorPicker } from "../inputs/ItemLabelColorPicker";
import { LootBeamSwitch } from "../inputs/LootBeamSwitch";
import {
  BooleanRuleInput,
  ItemIdRuleInput,
  ItemNameRuleInput,
  ItemNotedRuleInput,
  ItemStackableRuleInput,
  ItemTradeableRuleInput,
  ItemValueRuleInput,
} from "../inputs/LootRuleInputs";

const InputBox: React.FC<{ children?: React.ReactNode; title: string }> = ({
  children,
  title,
}) => {
  return (
    <Paper sx={{ border: "1px solid grey", padding: 2, borderRadius: 2 }}>
      <Typography variant="h6" color="primary">
        {title}
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />
      {children}
    </Paper>
  );
};

const InputDevelopmentTab: React.FC = () => {
  const [color, setColor] = useState<ArgbHexColor>("#FF02F201");
  const [beam, setBeam] = useState<boolean>(true);
  const [textColor, setTextColor] = useState<ArgbHexColor>("#FF000000");
  const [backgroundColor, setBackgroundColor] =
    useState<ArgbHexColor>("#FFCCCCCC");
  const [borderColor, setBorderColor] = useState<ArgbHexColor>("#FF02F201");
  const [menuTextColor, setMenuTextColor] = useState<ArgbHexColor>("#FF000000");


  const [itemNameRule, setItemNameRule] = useState<ItemNameRule>({
    type: "name",
    pattern: "",
  });

  const [itemIdRule, setItemIdRule] = useState<ItemIdRule>({
    type: "id",
    id: 0,
  });

  const [itemValueRule, setItemValueRule] = useState<ItemValueRule>({
    type: "value",
    operator: ">",
    value: 0,
  });

  const [itemNotedRule, setItemNotedRule] = useState<ItemNotedRule>({
    type: "noted",
    noted: false,
  });

  const [itemStackableRule, setItemStackableRule] = useState<ItemStackableRule>(
    {
      type: "stackable",
      stackable: false,
    }
  );

  const [itemTradeableRule, setItemTradeableRule] = useState<ItemTradeableRule>(
    {
      type: "tradeable",
      tradeable: false,
    }
  );

  const [booleanRule, setBooleanRule] = useState<BooleanRule>({
    type: "boolean",
    operator: "and",
    rules: [
      itemNameRule,
      itemIdRule,
      itemValueRule,
      itemNotedRule,
      itemStackableRule,
      itemTradeableRule,
    ],
  });

  return (
    <Container>
      <Box sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
        <InputBox title="Color Picker">
          <ColorPickerInput
            color={color}
            onChange={setColor}
            labelText="Color"
          />
        </InputBox>

        <InputBox title="Loot Beam Toggle">
          <LootBeamSwitch beam={beam} onChange={setBeam} />
        </InputBox>

        <InputBox title="Item Label Color Picker">
          {/* <ItemLabelColorPicker
            textColor={textColor}
            backgroundColor={backgroundColor}
            borderColor={borderColor}
            menuTextColor={menuTextColor}
            textColorOnChange={setTextColor}
            backgroundColorOnChange={setBackgroundColor}
            borderColorOnChange={setBorderColor}
            menuTextColorOnChange={setMenuTextColor}
          /> */}
        </InputBox>

        <InputBox title="Item Name Rule Input">
          <ItemNameRuleInput rule={itemNameRule} onChange={setItemNameRule} />
        </InputBox>

        <InputBox title="Item ID Rule Input">
          <ItemIdRuleInput rule={itemIdRule} onChange={setItemIdRule} />
        </InputBox>

        <InputBox title="Item Value Rule Input">
          <ItemValueRuleInput
            rule={itemValueRule}
            onChange={setItemValueRule}
          />
        </InputBox>

        <InputBox title="Item Noted Rule Input">
          <ItemNotedRuleInput
            rule={itemNotedRule}
            onChange={setItemNotedRule}
          />
        </InputBox>

        <InputBox title="Item Stackable Rule Input">
          <ItemStackableRuleInput
            rule={itemStackableRule}
            onChange={setItemStackableRule}
          />
        </InputBox>

        <InputBox title="Item Tradeable Rule Input">
          <ItemTradeableRuleInput
            rule={itemTradeableRule}
            onChange={setItemTradeableRule}
          />
        </InputBox>

        <InputBox title="Boolean Rule Input">
          <BooleanRuleInput rule={booleanRule} onChange={setBooleanRule} />
        </InputBox>
      </Box>
    </Container>
  );
};

export default InputDevelopmentTab;
