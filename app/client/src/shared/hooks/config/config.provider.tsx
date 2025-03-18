import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { ConfigContext } from "./config.context";
import { LoaderComponent } from "shared/components";
import { System } from "system";

type ConfigProps = {
  children: ReactNode;
};

export const ConfigProvider: React.FunctionComponent<ConfigProps> = ({
  children,
}) => {
  const [loadingMessage, setLoadingMessage] =
    useState<string>("Loading config...");

  useEffect(() => {
    fetch("/info")
      .then((response) => response.json())
      .then(async ({ data: config }) => {
        System.config.set(config);
        const lastVersion = localStorage.getItem("version");
        localStorage.setItem("version", config.version);

        if (lastVersion === config.version) return setLoadingMessage(null);

        setLoadingMessage("Loading changelog...");
        System.config.setChangeLog(
          (await (await fetch(`/changelog?from=${lastVersion}`)).json()).data,
        );

        setLoadingMessage(null);
      })
      .catch(() => {
        setLoadingMessage("Server is not reachable!");
      });
  }, [setLoadingMessage]);

  const getConfig = useCallback(() => System.config.get(), []);
  const getChangeLog = useCallback(() => System.config.getChangelog(), []);

  return (
    <ConfigContext.Provider
      value={{
        getChangeLog,
        getConfig,
      }}
      children={
        <LoaderComponent message={loadingMessage} children={children} />
      }
    />
  );
};
