import { ConfigTypes } from "shared/types/config.types.ts";

type Props = {
  url: string;
  connectionToken?: string;
};

export const auth = () => {
  let $config: ConfigTypes;

  let $hotelId: string;
  let $integrationId: string;
  //TODO permanent op
  let $ownerId: string;

  const load = async (config: ConfigTypes, checkLicense: boolean = false) => {
    $config = config;
    if (checkLicense && !(await isAuthEnabled()))
      console.error("/!\\ Auth service is down or Hotel License is not valid!");
  };

  const isAuthEnabled = async () => {
    if (!$config.auth.enabled) return true;

    try {
      const { hotelId, accountId, integrationId } = await $fetch({
        url: "/hotel/license",
      });
      $hotelId = hotelId;
      $integrationId = integrationId;
      $ownerId = accountId;
      return true;
    } catch (e) {
      return false;
    }
  };

  const $fetch = async ({ url, connectionToken }: Props) => {
    const { status, data } = await (
      await fetch(`${$config.auth.api}/api/v3${url}`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "license-token": $config.auth.licenseToken,
          ...(connectionToken
            ? {
                "connection-token": connectionToken,
              }
            : {}),
        }),
      })
    ).json();
    return data;
  };

  const getHotelId = () => $hotelId;
  const getIntegrationId = () => $integrationId;
  const getOwnerId = () => $ownerId;

  return {
    load,
    isAuthEnabled,

    fetch: $fetch,

    getHotelId,
    getIntegrationId,
    getOwnerId,
  };
};
