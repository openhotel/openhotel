import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterComponent } from "modules/router";
import "./modules/application/i18n";

const domNode = document.getElementById("root");

const root = createRoot(domNode);

root.render(
  <StrictMode>
    <RouterComponent />
  </StrictMode>,
);
