import React, { useEffect } from "react";
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
  AssetsProvider,
} from "shared/hooks";
import { System } from "system";

export const ApplicationComponent = () => {
  useEffect(() => {
    System.load();
  }, []);

  return (
    <InitialLoaderComponent>
      <ConfigProvider>
        <ProxyProvider>
          <AssetsProvider>
            <CoreLoaderComponent>
              <AccountProvider>
                <ModalProvider>
                  <RouterProvider />
                </ModalProvider>
              </AccountProvider>
            </CoreLoaderComponent>
          </AssetsProvider>
        </ProxyProvider>
      </ConfigProvider>
    </InitialLoaderComponent>
  );
};
