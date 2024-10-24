import React from "react";
import { createRoot } from "react-dom/client";

// @ts-ignore
import "./main.module.scss";
import "@oh/components/dist/style.css";

import { Application } from "@oh/components";
import { TestComponent } from "modules";

const domNode = document.getElementById("root");
const root = createRoot(domNode);

root.render(
  <Application>
    <TestComponent />
  </Application>,
);
