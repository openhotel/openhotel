import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";

export const stopEvent: ProxyEventType = {
  event: ProxyEvent.$STOP,
  func: () => {
    //@ts-ignore
    Deno.exit();
  },
};
