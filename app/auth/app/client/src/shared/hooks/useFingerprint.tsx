import { getFingerprint, setOption } from "@thumbmarkjs/thumbmarkjs";
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

type FingerprintState = {
  getFingerprint: () => string;
};

const FingerprintContext = React.createContext<FingerprintState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const FingerprintProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const fingerprint = useRef<string>(null);

  useEffect(() => {
    setOption("exclude", ["system.browser.version"]);
    getFingerprint().then(($fingerprint) => {
      fingerprint.current = $fingerprint;
    });
  }, []);

  const $getFingerprint = useCallback(() => fingerprint.current, [fingerprint]);

  return (
    <FingerprintContext.Provider
      value={{ getFingerprint: $getFingerprint }}
      children={children}
    />
  );
};

export const useFingerprint = (): FingerprintState =>
  useContext(FingerprintContext);
