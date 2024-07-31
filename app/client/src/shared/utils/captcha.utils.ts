import { captchaComponent, CaptchaMutable } from "shared/components";
import { getConfig } from "shared/utils/config.utils";

export const getCaptchaComponent = (
  onComplete?: (captchaId: string) => void,
): CaptchaMutable | null => {
  const { enabled, id: captchaId, url: captchaUrl } = getConfig().captcha;
  return enabled && captchaId && captchaUrl
    ? captchaComponent({ captchaId, captchaUrl, onComplete })
    : null;
};
