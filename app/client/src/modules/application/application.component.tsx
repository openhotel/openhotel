import React from "react";
import {
  CoreLoaderComponent,
  InitialLoaderComponent,
} from "modules/application";
import {
  ConfigProvider,
  ProxyProvider,
  RouterProvider,
  AccountProvider,
  ModalProvider,
} from "shared/hooks";

export const ApplicationComponent = () => {
  return (
    <InitialLoaderComponent>
      <ConfigProvider>
        <ProxyProvider>
          <CoreLoaderComponent>
            <AccountProvider>
              <ModalProvider>
                <RouterProvider />
              </ModalProvider>
            </AccountProvider>
          </CoreLoaderComponent>
        </ProxyProvider>
      </ConfigProvider>
    </InitialLoaderComponent>
  );
};
