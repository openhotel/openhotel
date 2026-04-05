import { System } from "modules/system/main.ts";

export const captcha = () => {
  let captchaScript = null;

  const load = async () => {
    if (!isEnabled()) return;

    const { id, token } = System.getConfig().captcha;

    try {
      const response = await fetch(
        `${System.captcha.getUrl()}/scripts/server.js?d=${Date.now()}`,
      );
      const code = await response.text();

      const dataUri = `data:application/javascript;charset=utf-8,${encodeURIComponent(code)}`;
      const { Captcha } = await import(dataUri);
      captchaScript = Captcha;

      captchaScript.init({
        appId: id,
        appToken: token,
      });
    } catch (e) {
      console.error("Captcha did not load because of an error!");
      console.error(e);
    }
  };

  const verify = async (captchaData: unknown): Promise<boolean> => {
    if (!isEnabled()) return true;
    if (!captchaData) return false;

    return await captchaScript.check(captchaData);
  };

  const isEnabled = () => {
    const { enabled, id, token, url } = System.getConfig().captcha;
    return Boolean(enabled && id && token && url);
  };

  const getUrl = () =>
    System.getConfig().captcha.url +
    (System.getConfig().version === "development" ? "/api" : "");

  return {
    load,
    verify,
    isEnabled,
    getUrl,
  };
};
