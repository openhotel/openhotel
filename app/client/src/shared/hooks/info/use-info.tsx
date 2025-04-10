import { useContext } from "react";
import { InfoContext, InfoState } from "./info.context";

export const useInfo = (): InfoState => useContext(InfoContext);
