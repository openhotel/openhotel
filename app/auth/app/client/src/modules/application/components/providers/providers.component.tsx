import { Outlet } from "react-router";
import { CaptchaV3Provider, TitleProvider, UserProvider } from "shared/hooks";
import React from "react";
import { ModalProvider } from "@openhotel/web-components";

export const ProvidersComponent = () => {
  return (
    <TitleProvider>
      <ModalProvider>
        <UserProvider>
          <CaptchaV3Provider>
            <Outlet />
          </CaptchaV3Provider>
        </UserProvider>
      </ModalProvider>
    </TitleProvider>
  );
};
