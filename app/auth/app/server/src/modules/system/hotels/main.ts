import { System } from "modules/system/main.ts";
import {
  DbHotel,
  HotelCreation,
  HotelIntegrationMutable,
  HotelIntegrationMutableGet,
  HotelListMutableGet,
  HotelMutable,
  HotelMutableGet,
} from "shared/types/hotel.types.ts";
import { integrations } from "./integrations.ts";
import { getTokenData } from "@oh/utils";
import * as bcrypt from "@da/bcrypt";
import { ulid } from "jsr:@std/ulid@1";

export const hotels = () => {
  const $getLicenseData = async (licenseToken: string) => {
    const { id: licenseId, token } = getTokenData(licenseToken);

    if (!licenseId || !token) return null;

    const license = await System.db.get(["licenses", licenseId]);
    if (!license) return null;

    if (!bcrypt.compareSync(token, license.tokenHash)) return null;

    return {
      hotelId: license.hotelId,
      integrationId: license.integrationId,
      accountId: license.accountId,
    };
  };

  const get = async (hotelId: string): Promise<DbHotel | null> => {
    const hotel = await System.db.get(["hotels", hotelId]);
    if (!hotel) return null;

    return hotel;
  };

  const getByLicenseToken = async (
    licenseToken: string,
  ): Promise<DbHotel | null> => {
    const license = await $getLicenseData(licenseToken);
    if (!license) return null;

    return await get(license.hotelId);
  };

  const getList = async ({ accountId }: HotelListMutableGet = {}): Promise<
    DbHotel[]
  > => {
    const hotelList = await System.db.list({ prefix: ["hotels"] });
    return (
      await Promise.all(hotelList.map(({ value }) => get(value.hotelId)))
    ).filter((hotel: DbHotel) => !accountId || accountId === hotel.accountId);
  };

  const getHotel = async ({
    licenseToken: $licenseToken,
    hotelId: $hotelId,
    request: $request,
  }: HotelMutableGet): Promise<HotelMutable | null> => {
    let licenseToken = $licenseToken;
    let hotel: DbHotel;
    if ($hotelId) hotel = await get($hotelId);
    else if ($licenseToken) hotel = await getByLicenseToken(licenseToken);
    else if ($request) {
      licenseToken = $request.headers.get("license-token");
      hotel = await getByLicenseToken(licenseToken);
    }

    if (!hotel) return null;

    const $integrations = integrations(hotel);

    const getLicenseData = async () => $getLicenseData(licenseToken);

    const getIntegration = ({
      integrationId,
      type,
    }: HotelIntegrationMutableGet) => {
      if (integrationId) return $integrations.getIntegration(integrationId);
      if (type) {
        const foundIntegration = hotel.integrations.find(
          (integration) => integration.type === type,
        );
        if (!foundIntegration) return null;
        return $integrations.getIntegration(foundIntegration.integrationId);
      }
    };
    const getIntegrations = (): HotelIntegrationMutable[] =>
      hotel.integrations.map((integration) =>
        $integrations.getIntegration(integration.integrationId),
      );

    const getOwner = async () => {
      return await System.accounts.getAccount({ accountId: hotel.accountId });
    };

    const getAccounts = async () => {
      const accounts = (
        await Promise.all(
          getIntegrations().map((integration) => integration.getAccounts()),
        )
      ).flat();

      const accountIdList = [];
      return accounts.filter((account) => {
        const { accountId } = account.getObject();
        if (accountIdList.includes(accountId)) return false;

        accountIdList.push(accountId);
        return account;
      });
    };

    const update = async ($hotel: Partial<DbHotel>) => {
      hotel = {
        ...hotel,
        ...$hotel,
        updatedAt: Date.now(),
      };
      await System.db.set(["hotels", hotel.hotelId], hotel);
    };

    const remove = async () => {
      for (const integration of getIntegrations()) await integration.remove();

      await System.db.delete(["hotels", hotel.hotelId]);
    };

    const getObject = (): DbHotel => ({
      ...hotel,
      verified: Boolean(hotel.verified),
      official: Boolean(hotel.official),
      blocked: Boolean(hotel.blocked),
    });

    return {
      getLicenseData,

      getIntegration,
      getIntegrations,

      getOwner,

      getAccounts,

      update,
      getObject,
      remove,

      integrations: $integrations,
    };
  };

  const getHotelList = async (
    searchData: HotelListMutableGet = {},
  ): Promise<HotelMutable[]> => {
    return await Promise.all((await getList(searchData)).map(getHotel));
  };

  const create = async ({
    public: $public,
    name,
    accountId,
  }: HotelCreation): Promise<string> => {
    const hotelId = ulid();

    await System.db.set(["hotels", hotelId], {
      hotelId,
      name,
      accountId,
      integrations: [],
      public: $public,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return hotelId;
  };

  return {
    getHotel,
    getHotelList,

    create,
  };
};
