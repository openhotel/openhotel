import { System } from "modules/system/main.ts";

export const captcha = () => {
  const load = async () => {
    if (!isEnabled()) return;
  };

  const verify = async (captchaData: { token: string }): Promise<boolean> => {
    if (!isEnabled()) return true;
    if (!captchaData || !captchaData.token) return false;

    const {
      captcha: { secret, siteKey, url },
    } = System.getConfig();

    const $url = new URL(url);
    $url.pathname = `/${siteKey}/siteverify`;

    const { success } = await fetch($url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ secret, response: captchaData.token }),
    }).then((response) => response.json());

    return success;
  };

  const isEnabled = () => {
    const { enabled, siteKey, secret, url } = System.getConfig().captcha;
    return Boolean(enabled && siteKey && secret && url);
  };

  const getUrl = () => System.getConfig().captcha.url;

  return {
    load,
    verify,
    isEnabled,
    getUrl,
  };
};
