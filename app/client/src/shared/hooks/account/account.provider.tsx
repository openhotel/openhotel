import React, { ReactNode, useEffect, useState } from "react";
import { useProxy } from "shared/hooks";
import { Event } from "shared/enums";
import { System } from "system";
import { AccountContext } from "./account.context";

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
