import React from "react";
import { SolveResult } from "@cap.js/widget";

export type CaptchaV3State = {
  solve: () => Promise<SolveResult> | SolveResult;
};

export const CaptchaV3Context = React.createContext<CaptchaV3State | null>(
  null,
);
