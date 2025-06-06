import { WorkerParent } from "worker_ionic";
import { ProxyEventType } from "shared/types/event.types.ts";

import { userJoinedEvent } from "./user-joined.event.ts";
import { userLeftEvent } from "./user-left.event.ts";
import { stopEvent } from "./stop.event.ts";
import { disconnectUserEvent } from "./disconnect-user.event.ts";
import { gameGuestCheckEvent } from "./game-guest-check.event.ts";

const eventList: ProxyEventType[] = [
  userJoinedEvent,
  userLeftEvent,
  stopEvent,
  disconnectUserEvent,
  gameGuestCheckEvent,
];

export const internal = () => {
  const load = ($worker: WorkerParent) => {
    for (const { event, func } of eventList) $worker.on(event, func);
  };

  return {
    load,
  };
};
