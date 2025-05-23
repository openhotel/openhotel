import React, { ReactNode, useCallback } from "react";
import { ProxyContext } from "../../../shared/hooks";
import { Event } from "../../../shared/enums";

type ProxyProps = {
  children: ReactNode;
};

export const FakeProxyProvider: React.FunctionComponent<ProxyProps> = ({
  children,
}) => {
  const load = useCallback(() => {}, []);

  const emit = useCallback((event: Event, message: unknown) => {}, []);

  const on = useCallback(
    (event: Event, callback: (data: unknown) => void | Promise<void>) => {
      return () => {};
    },
    [],
  );

  return (
    <ProxyContext.Provider
      value={{
        emit,
        on,
        load,
      }}
      children={children}
    />
  );
};
