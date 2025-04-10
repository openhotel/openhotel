import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useProxy } from "shared/hooks";
import { Event } from "shared/enums";
import { AccountContext } from "./account.context";
import { useAccountStore } from "./account.store";

type AccountProps = {
  children: ReactNode;
};

export const AccountProvider: React.FunctionComponent<AccountProps> = ({
  children,
}) => {
  const { load, on } = useProxy();

  const state = useAccountStore();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (state.account) {
      setLoading(false);
      return;
    }
    load();
    return on(Event.WELCOME, ({ account }) => {
      state.set(account);
      setLoading(false);
    });
  }, [load, on, setLoading, state]);

  const getAccount = useCallback(() => state.account, [state]);

  return (
    <AccountContext.Provider
      value={{
        getAccount,
      }}
      children={loading ? null : children}
    />
  );
};
