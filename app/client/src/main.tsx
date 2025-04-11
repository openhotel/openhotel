import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApplicationComponent } from "modules/application";
import { ApplicationProvider } from "@openhotel/pixi-components";

const domNode = document.getElementById("root");
const root = createRoot(domNode);

root.render(
  <StrictMode>
    <ApplicationProvider>
      <ApplicationComponent />
    </ApplicationProvider>
  </StrictMode>,
);
