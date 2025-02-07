import React from "react";
import { RouterComponent } from "../router";
import {
  FurnitureProvider,
  ScaleProvider,
  SideContentProvider,
} from "shared/hooks";
import { ModalProvider } from "@oh/components";

export const ApplicationComponent = () => {
  return (
    <ModalProvider>
      <SideContentProvider>
        <ScaleProvider>
          <FurnitureProvider>
            <RouterComponent />
          </FurnitureProvider>
        </ScaleProvider>
      </SideContentProvider>
    </ModalProvider>
  );
};
