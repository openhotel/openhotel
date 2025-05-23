import React, { ReactNode, useCallback } from "react";
import { ConfigContext } from "../../../shared/hooks";
import { ConfigTypes } from "../../../shared/types";

type ConfigProps = {
  children: ReactNode;
};

export const FakeConfigProvider: React.FunctionComponent<ConfigProps> = ({
  children,
}) => {
  const getConfig = useCallback(
    (): ConfigTypes => ({
      name: "Open Hotel",
      description: "Welcome to the Hotel!",
      version: "storybook",
      auth: {
        enabled: false,
        api: "",
      },
      onet: {
        enabled: false,
      },
      users: 0,
      maxUsers: 10,
      languages: ["en", "es"],
    }),
    [],
  );
  const getLastVersion = useCallback(() => "pre-storybook", []);

  const getVersion = useCallback(() => `storybook`, []);

  const isDevelopment = useCallback(() => false, []);

  return (
    <ConfigContext.Provider
      value={{
        getLastVersion,
        getConfig,
        getVersion,

        isDevelopment,
      }}
      children={children}
    />
  );
};
