import { EventType } from "shared/types/event.types.ts";
import { Event } from "shared/enums/event.enums.ts";

export const welcomeEvent: EventType<any> = {
  event: Event.WELCOME,
  func: ({ server, data }) => {
    console.log(
      `>: welcome '${server.getHotelData().name}' (${server.getHotelId()})`,
      data,
    );
  },
};
