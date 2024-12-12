import { Event } from "shared/enums/event.enums.ts";
import { HotelMutable } from "shared/types/hotel.types.ts";

type FuncProps<Data> = {
  data?: Data;
  hotel: HotelMutable;
};

export type EventType<Data extends unknown = undefined> = {
  event: Event;
  func: (data: FuncProps<Data>) => Promise<unknown> | unknown;
};
