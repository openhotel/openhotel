import React, { ReactNode, useContext, useEffect, useState } from "react";
import { ConfigTypes } from "shared/types";
import { LoaderComponent } from "shared/components";

type ConfigState = {
  changeLog: unknown;
  config: ConfigTypes;
};

const ConfigContext = React.createContext<ConfigState>(undefined);

type ConfigProps = {
  children: ReactNode;
};

export const ConfigProvider: React.FunctionComponent<ConfigProps> = ({
  children,
}) => {
  const [changeLog, setChangeLog] = useState(null);
  const [config, setConfig] = useState<ConfigTypes>(null);

  const [loadingMessage, setLoadingMessage] =
    useState<string>("Loading config...");

  useEffect(() => {
    fetch("/info")
      .then((response) => response.json())
      .then(async ({ data: config }) => {
        setConfig(config);
        const lastVersion = localStorage.getItem("version");
        localStorage.setItem("version", config.version);

        if (lastVersion === config.version) return setLoadingMessage(null);

        setLoadingMessage("Loading changelog...");
        setChangeLog(
          (await (await fetch(`/changelog?from=${lastVersion}`)).json()).data,
        );

        setLoadingMessage(null);
      })
      .catch(() => {
        setLoadingMessage("Server is not reachable!");
      });
  }, [setConfig, setChangeLog, setLoadingMessage]);

  return (
    <ConfigContext.Provider
      value={{
        changeLog,
        config,
      }}
      children={
        <LoaderComponent message={loadingMessage} children={children} />
      }
    />
  );
};

export const useConfig = (): ConfigState => useContext(ConfigContext);
