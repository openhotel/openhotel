import { Outlet } from "react-router";
import { TitleProvider } from "shared/hooks";
import React from "react";
import { ModalProvider } from "@openhotel/web-components";
import { SessionProvider } from "shared/hooks";

export const ProvidersComponent = () => {
  return (
    <SessionProvider>
      <TitleProvider>
        <ModalProvider>
          <Outlet />
        </ModalProvider>
      </TitleProvider>
    </SessionProvider>
  );
};
