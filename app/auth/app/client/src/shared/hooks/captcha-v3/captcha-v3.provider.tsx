import React, { useCallback, useEffect, useRef } from "react";
import "./captcha.config";
import { RequestMethod } from "shared/enums";
import { useApi } from "../useApi";
import Cap, { SolveResult } from "@cap.js/widget";
import { CaptchaV3Context } from "./captcha-v3.context";

type ProviderProps = {} & React.PropsWithChildren;

export const CaptchaV3Provider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const capRef = useRef<Cap | null>(null);

  const { fetch } = useApi();

  useEffect(() => {
    if (capRef.current) return;

    fetch({
      method: RequestMethod.GET,
      pathname: "/_/captcha",
    }).then(async (response) => {
      if (!response || !response.enabled) return;

      const { url, siteKey } = response;

      capRef.current = new Cap({
        apiEndpoint: `${url}${siteKey}`,
      });
    });
  }, []);

  const solve = useCallback(
    async () => capRef.current?.solve() ?? ({ success: true } as SolveResult),
    [],
  );

  return (
    <CaptchaV3Context.Provider
      value={{
        solve,
      }}
      children={children}
    />
  );
};
