import { OnetEventType } from "shared/types/event.types.ts";

import { connectedEvent } from "./connected.event.ts";
import { disconnectedEvent } from "./disconnected.event.ts";
import { reconnectingEvent } from "./reconnecting.event.ts";
import { welcomeEvent } from "./welcome.event.ts";

export const eventList: OnetEventType[] = [
  connectedEvent,
  disconnectedEvent,
  reconnectingEvent,
  welcomeEvent,
];
