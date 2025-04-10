import { useContext } from "react";
import { ConfigContext, ConfigState } from "./config.context";

export const useConfig = (): ConfigState => useContext(ConfigContext);
