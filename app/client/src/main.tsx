import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterComponent } from "modules/router";

const domNode = document.getElementById("root");

const root = createRoot(domNode);

root.render(
  <StrictMode>
    <RouterComponent />
  </StrictMode>,
);
