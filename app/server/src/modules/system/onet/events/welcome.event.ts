import { OnetEventType } from "shared/types/event.types.ts";
import { OnetEvent } from "shared/enums/event.enum.ts";
import { System } from "modules/system/main.ts";

export const welcomeEvent: OnetEventType = {
  event: OnetEvent.WELCOME,
  func: (data) => {
    System.onet.emit(OnetEvent.WELCOME, { dt: performance.now() });
  },
};
