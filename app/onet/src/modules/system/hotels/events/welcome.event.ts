import { EventType } from "shared/types/event.types.ts";
import { Event } from "shared/enums/event.enums.ts";

export const welcomeEvent: EventType<any> = {
  event: Event.WELCOME,
  func: ({ hotel, data }) => {
    console.log(
      `>: welcome '${hotel.getHotelData().name}' (${hotel.getHotelId()})`,
      data,
    );
  },
};
