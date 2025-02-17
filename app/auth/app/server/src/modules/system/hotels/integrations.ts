import { System } from "modules/system/main.ts";
import { generateToken } from "@oh/utils";
import {
  DbHotel,
  HotelIntegrationCreation,
  HotelIntegrationMutable,
  HotelIntegrationsMutable,
} from "shared/types/hotel.types.ts";
import { AccountMutable } from "shared/types/account.types.ts";
import { DbHotelIntegrationType } from "shared/enums/hotel.enums.ts";
import { ulid } from "jsr:@std/ulid@1";

export const integrations = (hotel: DbHotel): HotelIntegrationsMutable => {
  const getIntegration = (
    integrationId: string,
  ): HotelIntegrationMutable | null => {
    const integration = hotel.integrations.find(
      (integration) => integration.integrationId === integrationId,
    );
    if (!integration) return null;

    const generateLicense = async (): Promise<string> => {
      const accountId = hotel.accountId;
      const { token, id, tokenHash } = generateToken("lic", 16, 32);

      const licenseId = await System.db.get([
        "licensesByIntegrationId",
        integrationId,
      ]);
      if (licenseId) await System.db.delete(["licenses", licenseId]);

      await System.db.set(["licenses", id], {
        id,
        tokenHash,
        hotelId: hotel.hotelId,
        integrationId,
        accountId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      await System.db.set(["licensesByIntegrationId", integrationId], id);

      return token;
    };

    const addAccount = async (accountId: string, scopes: string[]) => {
      await System.db.set(
        [
          "integrationConnectionByAccountId",
          accountId,
          hotel.hotelId,
          integrationId,
        ],
        {
          accountId,

          hotelId: hotel.hotelId,
          integrationId,

          scopes,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      );
    };

    const removeAccount = async (accountId: string) => {
      await System.db.delete([
        "integrationConnectionByAccountId",
        accountId,
        hotel.hotelId,
        integrationId,
      ]);
    };

    const getAccounts = async (): Promise<AccountMutable[]> => {
      const integrations = await System.db.list({
        prefix: ["integrationConnectionByAccountId"],
      });
      return await Promise.all(
        integrations
          .filter(
            ({ value }) =>
              value.hotelId === hotel.hotelId &&
              value.integrationId === integrationId,
          )
          .map(({ value }) =>
            System.accounts.getAccount({ accountId: value.accountId }),
          ),
      );
    };

    const getObject = () => integration;

    const remove = async () => {
      const $hotel = await System.hotels.getHotel(hotel);

      await $hotel.update({
        integrations: hotel.integrations.filter(
          (integration) => integration.integrationId !== integrationId,
        ),
      });

      const licenseId = await System.db.get([
        "licensesByIntegrationId",
        integrationId,
      ]);
      if (licenseId) {
        await System.db.delete(["licensesByIntegrationId", integrationId]);
        await System.db.delete(["licenses", licenseId]);
      }

      for (const account of await getAccounts()) {
        const accountData = account.getObject();
        await System.db.delete([
          "integrationConnectionByAccountId",
          accountData.accountId,
          hotel.hotelId,
          integrationId,
        ]);
      }
    };

    const getHotel = () => System.hotels.getHotel({ hotelId: hotel.hotelId });

    return {
      generateLicense,

      addAccount,
      removeAccount,
      getAccounts,

      getObject,
      remove,

      getHotel,
    };
  };

  const addIntegration = async ({
    name,
    redirectUrl,
    type,
  }: HotelIntegrationCreation) => {
    const integrationId = ulid();

    try {
      new URL(redirectUrl).searchParams;
    } catch (e) {
      return null;
    }

    if (!Object.values(DbHotelIntegrationType).includes(type)) return;

    if (hotel.integrations.find((integration) => integration.type === type))
      return null;

    const $hotel = await System.hotels.getHotel({ hotelId: hotel.hotelId });
    await $hotel.update({
      integrations: [
        ...hotel.integrations,
        {
          integrationId,
          name,
          redirectUrl,
          type,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
    });

    return integrationId;
  };

  return {
    getIntegration,

    addIntegration,
  };
};
