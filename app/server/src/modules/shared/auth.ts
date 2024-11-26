import { ConfigTypes } from "shared/types/config.types.ts";

type Props = {
  url: string;
  connectionToken?: string;
};

export const auth = () => {
  let $config: ConfigTypes;

  const load = async (config: ConfigTypes, checkLicense: boolean = false) => {
    $config = config;
    if (checkLicense && !(await isAuthEnabled()))
      console.error("/!\\ Auth service is down or Hotel License is not valid!");
  };

  const isAuthEnabled = async () => {
    if (!$config.auth.enabled) return true;

    try {
      const { valid } = await $fetch({
        url: "hotels/check-license",
      });
      return valid;
    } catch (e) {
      return false;
    }
  };

  const $fetch = async ({ url, connectionToken }: Props) => {
    const { data } = await (
      await fetch(`${$config.auth.api}/api/v3/${url}`, {
        headers: new Headers({
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

  return {
    load,
    isAuthEnabled,

    fetch: $fetch,
  };
};
