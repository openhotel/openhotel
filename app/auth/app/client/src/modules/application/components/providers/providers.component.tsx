import { Outlet } from "react-router";
import { UserProvider } from "shared/hooks";
import React from "react";
import { ModalProvider } from "@oh/components";

export const ProvidersComponent = () => {
  return (
    <ModalProvider>
      <UserProvider>
        <Outlet />
      </UserProvider>
    </ModalProvider>
  );
};
