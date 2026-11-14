import { System } from "modules/system/main.ts";
import { HotelMutable } from "shared/types/hotel.types.ts";

export const getHotelFromRequest = (request: Request): HotelMutable => {
  const hotelId = request.headers.get("hotel-id");
  return System.hotels.get({ hotelId });
};
