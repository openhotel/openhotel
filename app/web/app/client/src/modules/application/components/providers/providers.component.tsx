import { Outlet } from "react-router";
import { TitleProvider } from "shared/hooks";
import React from "react";
import { ModalProvider } from "@openhotel/web-components";

export const ProvidersComponent = () => {
  return (
    <TitleProvider>
      <ModalProvider>
        <Outlet />
      </ModalProvider>
    </TitleProvider>
  );
};
