import { System } from "modules/system/main.ts";
import { Hotel, HotelMutable } from "shared/types/hotel.types.ts";
import { eventList } from "./events/main.ts";
import { Event } from "shared/enums/event.enums.ts";
import { getRandomString } from "@oh/utils";
import * as bcrypt from "@da/bcrypt";
import { Scope } from "shared/enums/scope.enums.ts";

export const hotels = () => {
  const $hotelMap: Record<string, HotelMutable> = {};
  const $hotelApiTokenMap: Record<string, string> = {};

  const $getHotel = (hotel: Hotel): HotelMutable | null => {
    if (!hotel) return null;
    const $hotel: Hotel = { ...hotel };

    const load = () => {
      for (const { event, func } of eventList)
        getSocket().on(event, (data: any) =>
          func({ hotel: $hotelMap[$hotel.hotelId], data }),
        );

      const apiToken = getRandomString(32) as string;
      $hotelApiTokenMap[$hotel.hotelId] = bcrypt.hashSync(
        apiToken,
        bcrypt.genSaltSync(8),
      );

      emit(Event.WELCOME, { apiToken });
    };

    const getSocket = () => System.serverSocket.getClient($hotel.clientId);
    const emit = <Data extends unknown>(
      event: Event,
      data: Data = {} as Data,
    ) => getSocket().emit(event, data);

    const getHotelData = () => $hotel.hotelData;

    const getHotelId = () => $hotel.hotelId;
    const getIntegrationId = () => $hotel.integrationId;

    const getToken = () => $hotel.licenseToken;

    const verify = (apiToken: string): boolean =>
      bcrypt.compareSync(apiToken, $hotelApiTokenMap[$hotel.hotelId]);

    const hasAccountScopes = async (
      accountId: string,
      scopes: Scope[],
    ): Promise<boolean> => {
      const { connection } = await System.auth.fetch<any>({
        pathname: `/tokens/user/connection?accountId=${accountId}`,
      });
      return (
        connection &&
        connection.hotelId === getHotelId() &&
        scopes.every((scope) => connection.scopes.includes(scope))
      );
    };

    const getObject = () => $hotel;

    return {
      load,

      getSocket,
      emit,

      getHotelData,

      getHotelId,
      getIntegrationId,

      getToken,

      verify,

      hasAccountScopes,

      getObject,
    };
  };

  const add = (server: Hotel) => {
    $hotelMap[server.hotelId] = $getHotel(server)!;
  };

  const remove = (server: Hotel) => {
    const $server = $hotelMap[server.hotelId];
    if (!$server) return;

    delete $hotelMap[server.hotelId];
  };

  const get = ({
    clientId,
    hotelId,
  }: Partial<Pick<Hotel, "hotelId" | "clientId">>) => {
    if (hotelId) return $hotelMap[hotelId];
    if (clientId)
      return getList().find(
        (server) => server.getObject().clientId === clientId,
      );
    return null;
  };

  const getList = () => Object.values($hotelMap);

  return {
    add,
    get,
    getList,
    remove,
  };
};
