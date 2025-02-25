import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/styles.css";

let buildInfo = { gitSha: "main" };
try {
  buildInfo = require("./build-info.json");
} catch {
  console.warn("Could not load build info, using default");
}

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App sha={buildInfo.gitSha} />
  </React.StrictMode>,
);
