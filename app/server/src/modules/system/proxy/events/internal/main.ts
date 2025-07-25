import { WorkerParent } from "worker_ionic";
import { ProxyEventType } from "shared/types/event.types.ts";

import { userJoinedEvent } from "./user-joined.event.ts";
import { userLeftEvent } from "./user-left.event.ts";
import { stopEvent } from "./stop.event.ts";
import { disconnectUserEvent } from "./disconnect-user.event.ts";
import { gameUserReadyEvent } from "./game-user-ready.event.ts";
import { gameUserLeftEvent } from "./game-user-left.event.ts";
import { gameUserDataEvent } from "./game-user-data.event.ts";

const eventList: ProxyEventType[] = [
  userJoinedEvent,
  userLeftEvent,
  stopEvent,
  disconnectUserEvent,
  // game
  gameUserReadyEvent,
  gameUserLeftEvent,
  gameUserDataEvent,
];

export const internal = () => {
  const load = ($worker: WorkerParent) => {
    for (const { event, func } of eventList) $worker.on(event, func);
  };

  return {
    load,
  };
};
