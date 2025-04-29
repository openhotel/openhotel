import { useContext } from "react";
import {
  SafeWindowContext,
  SafeWindowState,
} from "shared/hooks/safe-window/safe-window.context";

export const useSafeWindow = (): SafeWindowState =>
  useContext(SafeWindowContext);
