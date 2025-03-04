import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useProxy } from "shared/hooks/use-proxy";
import { Event } from "shared/enums";
import { System } from "system";

type AccountState = {};

const AccountContext = React.createContext<AccountState>(undefined);

type AccountProps = {
  children: ReactNode;
};

export const AccountProvider: React.FunctionComponent<AccountProps> = ({
  children,
}) => {
  const { load, on } = useProxy();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (System.account.getAccount()) {
      setLoading(false);
      return;
    }
    load();
    return on(Event.WELCOME, ({ account }) => {
      System.account.setAccount(account);
      setLoading(false);
    });
  }, [load, on, setLoading]);

  return (
    <AccountContext.Provider value={{}} children={loading ? null : children} />
  );
};

export const useAccount = (): AccountState => useContext(AccountContext);
