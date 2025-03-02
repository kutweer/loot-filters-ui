import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { isNumber } from "underscore";
import {
  BooleanRule,
  ItemIdRule,
  ItemNameRule,
  ItemNotedRule,
  ItemStackableRule,
  ItemTradeableRule,
  ItemValueRule,
  LootRule,
  LootRuleType,
  lootRuleTypes,
} from "../../types/FilterTypes2";
import { DeleteOutline } from "@mui/icons-material";

export const BaseLootRuleInput: React.FC<{
  onChange: (rule: LootRule) => void;
}> = ({ onChange }) => {
  return <div>BaseItemRuleInput</div>;
};

export const ItemNameRuleInput: React.FC<{
  rule: ItemNameRule;
  onChange: (rule: ItemNameRule) => void;
}> = ({ rule, onChange }) => {
  return (
    <TextField
      size="small"
      label="Item Name or Pattern"
      value={rule.pattern}
      onChange={(e) => onChange({ ...rule, pattern: e.target.value })}
    />
  );
};

const parseNumber = (value: string) => {
  const parsed = Number(value);
  return isNumber(parsed) && parsed >= 0
    ? parsed
    : (value as unknown as number);
};

export const ItemIdRuleInput: React.FC<{
  rule: ItemIdRule;
  onChange: (rule: ItemIdRule) => void;
}> = ({ rule, onChange }) => {
  return (
    <TextField
      size="small"
      label="Item ID"
      value={rule.id || ""}
      onChange={(e) => onChange({ ...rule, id: parseNumber(e.target.value) })}
      error={!isNumber(rule.id)}
      helperText={!isNumber(rule.id) ? "Item ID must be a positive number" : ""}
    />
  );
};

export const ItemValueRuleInput: React.FC<{
  rule: ItemValueRule;
  onChange: (rule: ItemValueRule) => void;
}> = ({ rule, onChange }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
      <Typography
        variant="body2"
        sx={{ marginTop: "auto", marginBottom: "auto" }}
      >
        Value of Item Stack is
      </Typography>
      <Select
        size="small"
        value={rule.operator}
        onChange={(e) =>
          onChange({
            ...rule,
            operator: e.target.value as ItemValueRule["operator"],
          })
        }
      >
        <MenuItem value="<">Less than</MenuItem>
        <MenuItem value=">">Greater than</MenuItem>
        <MenuItem value=">=">Greater than or equal to</MenuItem>
        <MenuItem value="<=">Less than or equal to</MenuItem>
      </Select>

      <TextField
        size="small"
        label="Item Value"
        value={rule.value || ""}
        onChange={(e) =>
          onChange({ ...rule, value: parseNumber(e.target.value) })
        }
        error={!isNumber(rule.value)}
        helperText={
          !isNumber(rule.value) ? "Item Value must be a positive number" : ""
        }
      />
    </div>
  );
};

const BaseSwitchRuleInput: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ checked, onChange, label }) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      }
      label={label}
    />
  );
};

export const ItemNotedRuleInput: React.FC<{
  rule: ItemNotedRule;
  onChange: (rule: ItemNotedRule) => void;
}> = ({ rule, onChange }) => {
  return (
    <BaseSwitchRuleInput
      label={`Item is ${rule.noted ? "noted" : "not noted"}`}
      checked={rule.noted}
      onChange={(checked) => onChange({ ...rule, noted: checked })}
    />
  );
};

export const ItemStackableRuleInput: React.FC<{
  rule: ItemStackableRule;
  onChange: (rule: ItemStackableRule) => void;
}> = ({ rule, onChange }) => {
  return (
    <BaseSwitchRuleInput
      label={`Item is ${rule.stackable ? "stackable" : "not stackable"}`}
      checked={rule.stackable}
      onChange={(checked) => onChange({ ...rule, stackable: checked })}
    />
  );
};

export const ItemTradeableRuleInput: React.FC<{
  rule: ItemTradeableRule;
  onChange: (rule: ItemTradeableRule) => void;
}> = ({ rule, onChange }) => {
  return (
    <BaseSwitchRuleInput
      label={`Item is ${rule.tradeable ? "tradeable" : "not tradeable"}`}
      checked={rule.tradeable}
      onChange={(checked) => onChange({ ...rule, tradeable: checked })}
    />
  );
};

const getRuleComponent = (
  rule: LootRule,
  onChange: (rule: LootRule) => void
) => {
  switch (rule.type) {
    case "name":
      return <ItemNameRuleInput rule={rule} onChange={onChange} />;
    case "id":
      return <ItemIdRuleInput rule={rule} onChange={onChange} />;
    case "value":
      return <ItemValueRuleInput rule={rule} onChange={onChange} />;
    case "noted":
      return <ItemNotedRuleInput rule={rule} onChange={onChange} />;
    case "stackable":
      return <ItemStackableRuleInput rule={rule} onChange={onChange} />;
    case "tradeable":
      return <ItemTradeableRuleInput rule={rule} onChange={onChange} />;
    case "boolean":
      return (
        <Typography variant="body2" color="error">
          Nested Boolean rules unsupported at this time
        </Typography>
      );
  }
};

const renderRuleComponentFragment = (
  rule: LootRule,
  onChange: (rule: LootRule) => void,
  onDelete: () => void
) => {
  return (
    <div>
      {getRuleComponent(rule, onChange)}
      {
        <IconButton size="small" onClick={onDelete}>
          <DeleteOutline />
        </IconButton>
      }
    </div>
  );
};

export const BooleanRuleInput: React.FC<{
  rule: BooleanRule;
  onChange: (rule: BooleanRule) => void;
}> = ({ rule: { operator, rules }, onChange }) => {
  const buildNewRule = (rule: LootRuleType): LootRule => {
    switch (rule) {
      case "name":
        return { type: "name", pattern: "" };
      case "id":
        return { type: "id", id: 0 };
      case "value":
        return { type: "value", operator: ">", value: 0 };
      case "noted":
        return { type: "noted", noted: false };
      case "stackable":
        return { type: "stackable", stackable: false };
      case "tradeable":
        return { type: "tradeable", tradeable: false };
      case "boolean":
        return { type: "boolean", operator: "and", rules: [] };
      default:
        throw new Error(`Unknown rule type: ${rule}`);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 5, mb: 2 }}>
        <FormControl sx={{ width: "150px" }}>
          <InputLabel id="operator-label">Boolean Rule Operator</InputLabel>
          <Select
            labelId="operator-label"
            size="small"
            value={operator}
            onChange={(e) =>
              onChange({
                type: "boolean",
                rules,
                operator: e.target.value as BooleanRule["operator"],
              })
            }
          >
            <MenuItem value="and">AND</MenuItem>
            <MenuItem value="or">OR</MenuItem>
            <MenuItem value="not">NOT</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ width: "150px" }}>
          <InputLabel id="add-rule-label">Add Rule</InputLabel>
          <Select
            labelId="add-rule-label"
            size="small"
            value={null}
            onChange={(e) =>
              onChange({
                type: "boolean",
                rules: [...rules, buildNewRule(e.target.value as LootRuleType)],
                operator: operator,
              })
            }
          >
            {lootRuleTypes.map((rule) => (
              <MenuItem key={rule} value={rule}>
                {rule.charAt(0).toUpperCase() + rule.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 5 }}>
        <Box sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
          {rules.map((innerRule, index) => (
            <div
              key={index}
              style={{ display: "flex", flexDirection: "row", gap: 5 }}
            >
              {index == 0 ? null : (
                <Typography sx={{ marginRight: 1 }} variant="body2">
                  {operator === "and"
                    ? "AND"
                    : operator === "or"
                      ? "OR"
                      : "NOT"}
                </Typography>
              )}
              {renderRuleComponentFragment(
                innerRule,
                (changedInnerRule) => {
                  const newRules = [...rules];
                  newRules[index] = changedInnerRule;
                  onChange({
                    type: "boolean",
                    operator,
                    rules: newRules,
                  });
                },
                () => {
                  const newRules = [...rules];
                  newRules.splice(index, 1);
                  onChange({
                    type: "boolean",
                    operator,
                    rules: newRules,
                  });
                }
              )}
            </div>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
