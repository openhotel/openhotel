import React from "react";
import { RouterComponent } from "../router";
import { Outlet } from "react-router";
import { AccountProvider } from "shared/hooks";

export const ApplicationComponent = () => {
  return (
    <AccountProvider>
      <RouterComponent>
        <Outlet />
      </RouterComponent>
    </AccountProvider>
  );
};
