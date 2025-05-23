import React, { ReactNode, useCallback, useEffect } from "react";
import { AccountContext, useAccountStore } from "../../../shared/hooks";
import { Hemisphere } from "../../../shared/enums";
import { FAKE_ACCOUNT_ID_1 } from "./fake-account.consts";

type AccountProps = {
  children: ReactNode;
};

export const FakeAccountProvider: React.FunctionComponent<AccountProps> = ({
  children,
}) => {
  const { set, account } = useAccountStore();

  useEffect(() => {
    set({
      accountId: FAKE_ACCOUNT_ID_1,
      apiToken: "",
      hemisphere: Hemisphere.NORTH,
      username: "storybook",
    });
  }, [set]);

  const getAccount = useCallback(() => account, [account]);

  return (
    <AccountContext.Provider
      value={{
        getAccount,
      }}
      children={children}
    />
  );
};
