import React from "react";
import { RouterComponent } from "../router";
import { SideContentProvider, AppSessionProvider } from "shared/hooks";
import { ModalProvider } from "@oh/components";

export const ApplicationComponent = () => {
  return (
    <AppSessionProvider>
      <ModalProvider>
        <SideContentProvider>
          <RouterComponent />
        </SideContentProvider>
      </ModalProvider>
    </AppSessionProvider>
  );
};
