import { OnetEventType } from "shared/types/event.types.ts";
import { OnetEvent } from "shared/enums/event.enum.ts";
import { System } from "modules/system/main.ts";

export const disconnectedEvent: OnetEventType = {
  event: OnetEvent.DISCONNECTED,
  func: (data) => {
    System.onet.$setIsConnected(false);
  },
};
