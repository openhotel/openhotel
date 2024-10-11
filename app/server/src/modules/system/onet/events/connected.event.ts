import { OnetEventType } from "shared/types/event.types.ts";
import { OnetEvent } from "shared/enums/event.enum.ts";
import { System } from "modules/system/main.ts";

export const connectedEvent: OnetEventType = {
  event: OnetEvent.CONNECTED,
  func: (data) => {
    System.onet.$setIsConnected(true);
  },
};
