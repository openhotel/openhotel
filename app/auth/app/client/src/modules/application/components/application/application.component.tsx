import React from "react";
import { RouterComponent } from "../router";
import { Outlet } from "react-router";
import { AccountProvider, FingerprintProvider } from "shared/hooks";

export const ApplicationComponent = () => {
  return (
    <FingerprintProvider>
      <AccountProvider>
        <RouterComponent>
          <Outlet />
        </RouterComponent>
      </AccountProvider>
    </FingerprintProvider>
  );
};
