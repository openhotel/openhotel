import React, { useEffect } from "react";
import { useAccount, useUser } from "shared/hooks";
import { RedirectComponent } from "shared/components";
import { MainLayoutComponent } from "@oh/components";
import { HomeNavigatorComponent } from "modules/account";

type Props = {
  children: React.ReactNode;
};

export const WrapperLayoutComponent = ({ children }: Props) => {
  const { isLogged } = useAccount();
  const { user, refresh } = useUser();

  useEffect(() => {
    if (!isLogged || user) return;
    refresh();
  }, [user, isLogged, refresh]);

  if (isLogged === null) return <div>Loading...</div>;
  if (!isLogged) return <RedirectComponent to="/login" />;

  return (
    <MainLayoutComponent
      children={children}
      navigatorChildren={<HomeNavigatorComponent />}
    />
  );
};
