import React, { ReactNode, useContext, useEffect, useState } from "react";
import { ConfigTypes } from "shared/types";
import { LoaderComponent } from "shared/components";

type ConfigState = {
  lastVersion: string;
  config: ConfigTypes;
};

const ConfigContext = React.createContext<ConfigState>(undefined);

type ConfigProps = {
  children: ReactNode;
};

export const ConfigProvider: React.FunctionComponent<ConfigProps> = ({
  children,
}) => {
  const [lastVersion, setLastVersion] = useState<string>("v0.0.0");
  const [config, setConfig] = useState<ConfigTypes>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/info")
      .then((response) => response.json())
      .then(({ data: config }) => {
        setConfig(config);
        setLastVersion(localStorage.getItem("version"));
        localStorage.setItem("version", config.version);
        setLoading(false);
      });
  }, [setConfig, setLastVersion, setLoading]);

  return (
    <ConfigContext.Provider
      value={{
        lastVersion,
        config,
      }}
      children={
        <LoaderComponent
          message={loading ? "Loading config..." : null}
          children={children}
        />
      }
    />
  );
};

export const useConfig = (): ConfigState => useContext(ConfigContext);
