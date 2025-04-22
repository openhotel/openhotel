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
  const changeLogRef = useRef<unknown>(null);

  const [loadingMessage, setLoadingMessage] =
    useState<string>("Loading config...");

  useEffect(() => {
    fetch("/info")
      .then((response) => response.json())
      .then(async ({ data: config }) => {
        configRef.current = config;
        const lastVersion = localStorage.getItem("version");
        localStorage.setItem("version", config.version);

        if (lastVersion === config.version) return setLoadingMessage(null);

        setLoadingMessage("Loading changelog...");
        (changeLogRef.current = (
          await (await fetch(`/changelog?from=${lastVersion}`)).json()
        ).data),
          setLoadingMessage(null);
      })
      .catch(() => {
        setLoadingMessage("Server is not reachable!");
      });
  }, [setLoadingMessage]);

  const getConfig = useCallback(() => configRef.current, []);
  const getChangeLog = useCallback(() => changeLogRef.current, []);

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
        getChangeLog,
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
