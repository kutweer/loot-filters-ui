import { FilterModule } from "../types/FilterModule";

const cluesModule: FilterModule = {
  name: "Clues",
  input: [
    {
      name: "VAR_CLUE_HIDE",
      label: "Hide clue tiers",
      type: "itemlist",
      enum: [
        "clue scroll (beginner)",
        "clue scroll (easy)",
        "clue scroll (medium)",
        "clue scroll (hard)",
        "clue scroll (elite)",
        "clue scroll (master)",
      ],
    },
    {
      name: "VAR_CLUE_BEGINNER_CUSTOMSTYLE",
      label: "Display: beginner clue",
      type: "style",
    },
    {
      name: "VAR_CLUE_EASY_CUSTOMSTYLE",
      label: "Display: easy clue",
      type: "style",
    },
    {
      name: "VAR_CLUE_MEDIUM_CUSTOMSTYLE",
      label: "Display: medium clue",
      type: "style",
    },
    {
      name: "VAR_CLUE_HARD_CUSTOMSTYLE",
      label: "Display: hard clue",
      type: "style",
    },
    {
      name: "VAR_CLUE_ELITE_CUSTOMSTYLE",
      label: "Display: elite clue",
      type: "style",
    },
    {
      name: "VAR_CLUE_MASTER_CUSTOMSTYLE",
      label: "Display: master clue",
      type: "style",
    },
  ],
};

// export const filterscape: Rs2fFilter = {
//   name: "Filterscape",
//   description: "Filterscape is a filter that filters items based on the item list and style.",
//   modules: [
//     {
//       name: "Clues",
//       moduleJson: "https://raw.githubusercontent.com/riktenx/filterscape/refs/heads/main/clue/mod_clue.json",
//       rs2f: "https://raw.githubusercontent.com/riktenx/filterscape/refs/heads/main/clue/mod_clue.rs2f",
//     },
//     {
//       name: "Herb",
//       moduleUrl: "https://raw.githubusercontent.com/riktenx/filterscape/refs/heads/main/herb/module.json",
//       rs2fUrl: "https://raw.githubusercontent.com/riktenx/filterscape/refs/heads/main/herb/module.rsf2",
//     },
//   ],
// };
