import { WorkerParent } from "worker_ionic";
import { ProxyEventType } from "shared/types/event.types.ts";

import { userJoinedEvent } from "./user-joined.event.ts";
import { userLeftEvent } from "./user-left.event.ts";
import { stopEvent } from "./stop.event.ts";
import { disconnectUserEvent } from "./disconnect-user.event.ts";

const eventList: ProxyEventType[] = [
  userJoinedEvent,
  userLeftEvent,
  stopEvent,
  disconnectUserEvent,
];

export const loadInternalEvents = ($worker: WorkerParent) => {
  for (const { event, func } of eventList) $worker.on(event, func);
};
