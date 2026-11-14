import React from "react";
import { createRoot } from "react-dom/client";

// @ts-ignore
import "./main.scss";
import "@openhotel/styles/dist/style.css";
import "@openhotel/styles/styles.scss";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { ApplicationComponent } from "modules/application";

const domNode = document.getElementById("root");
const root = createRoot(domNode);

dayjs.extend(relativeTime);

root.render(<ApplicationComponent />);
