import { System } from "modules/system/main.ts";
import { HotelMutable } from "shared/types/hotel.types.ts";
import { getResponse, HttpStatusCode } from "@oh/utils";

export const isRequestAuthenticated = (request: Request) => {
  const hotelId = request.headers.get("hotel-id");
  const token = request.headers.get("token");

  if (!hotelId || !token) return getResponse(HttpStatusCode.FORBIDDEN);

  const hotel = System.hotels.get({ hotelId });
  return hotel.verify(token);
};

export const getHotelFromRequest = (request: Request): HotelMutable => {
  const hotelId = request.headers.get("hotel-id");
  return System.hotels.get({ hotelId });
};
