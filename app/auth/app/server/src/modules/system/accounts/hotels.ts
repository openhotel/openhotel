import { HotelCreation, HotelMutable } from "shared/types/hotel.types.ts";
import { System } from "modules/system/main.ts";
import { AccountHotelsMutable, DbAccount } from "shared/types/account.types.ts";

export const hotels = (account: DbAccount): AccountHotelsMutable => {
  const getList = async (): Promise<HotelMutable[]> => {
    return await System.hotels.getHotelList({ accountId: account.accountId });
  };

  const create = async ({
    name,
    public: $public,
  }: Omit<HotelCreation, "accountId">): Promise<string | null> => {
    const hotels = await getList();
    if (hotels.length >= System.getConfig().accounts.maxHotels) return null;

    return await System.hotels.create({
      name,
      public: $public,
      accountId: account.accountId,
    });
  };

  const removeIntegration = async (hotelId: string, integrationId: string) => {
    const hotel = await System.hotels.getHotel({ hotelId });
    if (!hotel) return;

    const integration = hotel.getIntegration({ integrationId });
    if (!integration) return;

    await integration.removeAccount(account.accountId);
  };

  return {
    create,
    getList,

    remove: removeIntegration,
  };
};
