import React from "react";
import { Event } from "shared/enums";

export type ProxyState = {
  emit: <Data>(event: Event, data: Data) => void;
  on: (
    event: Event,
    callback: (data: unknown) => void | Promise<void>,
  ) => () => void;
  load: () => void;
};

export const ProxyContext = React.createContext<ProxyState>(undefined);
