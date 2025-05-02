import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useProxy } from "shared/hooks";
import { Event } from "shared/enums";
import { AccountContext } from "./account.context";
import { useAccountStore } from "./account.store";
import { useLanguage } from "shared/hooks/language";

type AccountProps = {
  children: ReactNode;
};

export const AccountProvider: React.FunctionComponent<AccountProps> = ({
  children,
}) => {
  const { load, on } = useProxy();
  const { changeLanguage } = useLanguage();

  const state = useAccountStore();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (state.account) {
      setLoading(false);
      return;
    }
    load();
    return on(Event.WELCOME, async ({ account }) => {
      state.set(account);

      await changeLanguage(account.languages[0]);
      setLoading(false);
    });
  }, [load, on, setLoading, state, changeLanguage]);

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
