import React from "react";
import { RouterComponent } from "../router";
import {
  FurnitureProvider,
  ScaleProvider,
  SideContentProvider,
} from "shared/hooks";
import { ModalProvider } from "@openhotel/components";
import { AppSessionProvider } from "shared/hooks/useAppSession";

export const ApplicationComponent = () => {
  return (
    <AppSessionProvider>
      <ModalProvider>
        <SideContentProvider>
          <ScaleProvider>
            <FurnitureProvider>
              <RouterComponent />
            </FurnitureProvider>
          </ScaleProvider>
        </SideContentProvider>
      </ModalProvider>
    </AppSessionProvider>
  );
};
