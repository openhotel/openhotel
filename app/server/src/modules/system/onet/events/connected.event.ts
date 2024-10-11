import { OnetEventType } from "shared/types/event.types.ts";
import { OnetEvent } from "shared/enums/event.enum.ts";
import { System } from "modules/system/main.ts";
import { log } from "shared/utils/log.utils.ts";

export const connectedEvent: OnetEventType = {
  event: OnetEvent.CONNECTED,
  func: (data) => {
    System.onet.$setIsConnected(true);
    log(`Onet connected!`);
  },
};
