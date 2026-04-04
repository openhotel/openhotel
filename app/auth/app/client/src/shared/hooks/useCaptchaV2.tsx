import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RequestMethod } from "../enums";
import { useApi } from "./useApi";

type CaptchaV2State = {
  captchaReady: boolean;
  submit: () => unknown;
};

const CaptchaV2Context = React.createContext<CaptchaV2State>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const CaptchaV2Provider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const captchaScriptRef = useRef(null);
  const [captchaConfig, setCaptchaConfig] = useState<{
    enabled: boolean;
    url: string;
    id: string;
  } | null>(null);
  const [captchaReady, setCaptchaReady] = useState<boolean>(false);

  const { fetch } = useApi();

  useEffect(() => {
    fetch({
      method: RequestMethod.GET,
      pathname: "/_/captcha",
    })
      .then(async (response) => {
        if (!response) return;

        const enabled = response?.enabled ?? false;

        setCaptchaConfig({
          enabled,
          url: response?.url ?? "",
          id: response?.id ?? "",
        });

        if (!enabled) return setCaptchaReady(true);

        captchaScriptRef.current = (
          await import(`${response.url}/scripts/client.js`)
        )?.Captcha;

        captchaScriptRef.current
          .init({ appId: response?.id })
          .then(setCaptchaReady);
      })
      .catch(() => {
        setCaptchaConfig({ enabled: false, url: "", id: "" });
      });
  }, [setCaptchaReady, setCaptchaConfig]);

  const submit = useCallback(async () => {
    if (!captchaConfig.enabled) return null;
    return await captchaScriptRef.current.submit();
  }, [captchaConfig]);

  return (
    <CaptchaV2Context.Provider
      value={{
        captchaReady,
        submit,
      }}
      children={children}
    />
  );
};

export const useCaptchaV2 = (): CaptchaV2State => useContext(CaptchaV2Context);
