import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ConfigContext } from "./config.context";
import { LoaderComponent } from "shared/components";
import { ConfigTypes } from "shared/types";

type ConfigProps = {
  children: ReactNode;
};

export const ConfigProvider: React.FunctionComponent<ConfigProps> = ({
  children,
}) => {
  const configRef = useRef<ConfigTypes>(null);
  const lastVersionRef = useRef<string>(null);

  const [loadingMessage, setLoadingMessage] = useState<string>(
    "Loading configuration...",
  );

  useEffect(() => {
    fetch("/info")
      .then((response) => response.json())
      .then(async ({ data: config }) => {
        configRef.current = config;
        lastVersionRef.current = localStorage.getItem("version");
        localStorage.setItem("version", config.version);

        setLoadingMessage(null);
      })
      .catch(() => {
        setLoadingMessage("Server is not reachable!");
      });
  }, [setLoadingMessage]);

  const getConfig = useCallback(() => configRef.current, []);
  const getLastVersion = useCallback(() => lastVersionRef.current, []);

  const getVersion = useCallback(
    () => `${configRef.current.version}-alpha`,
    [],
  );

  const isDevelopment = useCallback(
    () => configRef.current.version === "development",
    [],
  );

  return (
    <ConfigContext.Provider
      value={{
        getLastVersion,
        getConfig,
        getVersion,

        isDevelopment,
      }}
      children={
        <LoaderComponent message={loadingMessage} children={children} />
      }
    />
  );
};
