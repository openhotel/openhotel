import React from "react";
import { createRoot } from "react-dom/client";
import { ApplicationComponent } from "modules/application/components/application.component.tsx";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

createRoot(document.getElementById("root")!)!.render(<ApplicationComponent />);
