import { getFingerprint, setOption } from "@thumbmarkjs/thumbmarkjs";
import React, { ReactNode, useContext, useEffect, useState } from "react";

type FingerprintState = {
  fingerprint: string;
};

const FingerprintContext = React.createContext<FingerprintState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const FingerprintProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const [fingerprint, setFingerprint] = useState<string>(null);

  useEffect(() => {
    setOption("exclude", [
      //prevents browser version change
      "system.browser.version",
      "system.useragent",
      //prevents updates on webgl
      "webgl",
      //prevents screen changes
      "screen",
      //prevent audio changes
      "audio",
      //prevents plugin installs/uninstalls
      "plugins",
    ]);
    getFingerprint().then(setFingerprint);
  }, [setFingerprint]);

  return (
    <FingerprintContext.Provider
      value={{ fingerprint }}
      children={fingerprint ? children : null}
    />
  );
};

export const useFingerprint = (): FingerprintState =>
  useContext(FingerprintContext);
