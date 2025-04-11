import { Outlet } from "react-router";
import { TitleProvider, UserProvider } from "shared/hooks";
import React from "react";
import { ModalProvider } from "@openhotel/components";

export const ProvidersComponent = () => {
  return (
    <TitleProvider>
      <ModalProvider>
        <UserProvider>
          <Outlet />
        </UserProvider>
      </ModalProvider>
    </TitleProvider>
  );
};
