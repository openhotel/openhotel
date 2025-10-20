import React from "react";
import { MainLayoutComponent } from "@openhotel/web-components";
import { HeaderComponent } from "modules/account";
import { useSession } from "shared/hooks";

type Props = {
  children: React.ReactNode;
};

export const WrapperLayoutComponent = ({ children }: Props) => {
  const { account } = useSession();
  return (
    <MainLayoutComponent
      children={children}
      headerChildren={account !== undefined ? <HeaderComponent /> : null}
    />
  );
};
