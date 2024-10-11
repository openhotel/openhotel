import { OnetEventType } from "shared/types/event.types.ts";
import { OnetEvent } from "shared/enums/event.enum.ts";
import { System } from "modules/system/main.ts";

export const reconnectingEvent: OnetEventType = {
  event: OnetEvent.RECONNECTING,
  func: (data) => {
    System.onet.$setIsConnected(false);
  },
};
