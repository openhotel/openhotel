import React, { ReactNode, useCallback } from "react";
import { ApiContext } from "shared/hooks/api/api.context";
import { useConfig } from "shared/hooks/config";

type ApiProps = {
  children: ReactNode;
};

export const ApiPhantomProvider: React.FunctionComponent<ApiProps> = ({
  children,
}) => {
  const { isDevelopment } = useConfig();

  const getPath = useCallback(
    (pathname: string) => {
      return `${isDevelopment() ? "proxy" : ""}/api${pathname}`;
    },
    [isDevelopment],
  );

  const $fetch = useCallback(async (): Promise<unknown> => {
    return null;
  }, []);

  return (
    <ApiContext.Provider
      value={{
        fetch: $fetch,
        getPath,
      }}
      children={children}
    />
  );
};
