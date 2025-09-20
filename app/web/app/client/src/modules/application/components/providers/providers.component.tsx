import { Outlet } from "react-router";
import { TitleProvider, AppSessionProvider } from "shared/hooks";
import React from "react";
import { ModalProvider } from "@openhotel/web-components";

export const ProvidersComponent = () => {
  return (
    <AppSessionProvider>
      <TitleProvider>
        <ModalProvider>
          <Outlet />
        </ModalProvider>
      </TitleProvider>
    </AppSessionProvider>
  );
};
