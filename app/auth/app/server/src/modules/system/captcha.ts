import { System } from "modules/system/main.ts";

export const captcha = () => {
  const verify = async (sessionId: string): Promise<boolean> => {
    const { id, token, url } = System.getConfig().captcha;
    if (!isEnabled()) return true;
    if (!sessionId) return false;

    const headers = new Headers();
    headers.append("id", id);
    headers.append("token", token);

    try {
      const data = await fetch(`${url}/v1/verify`, {
        method: "POST",
        headers,
        body: JSON.stringify({ sessionId }),
      }).then((response) => response.json());

      return Boolean(data?.valid);
    } catch (e) {
      return false;
    }
  };

  const isEnabled = () => {
    const { enabled, id, token, url } = System.getConfig().captcha;
    return Boolean(enabled && id && token && url);
  };

  return {
    verify,
    isEnabled,
  };
};
