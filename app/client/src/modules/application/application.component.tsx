import React, { useEffect } from "react";
import {
  CoreLoaderComponent,
  InitialLoaderComponent,
} from "modules/application";
import {
  ConfigProvider,
  ProxyProvider,
  RouterProvider,
  ModalProvider,
  AssetsProvider,
  AccountProvider,
} from "shared/hooks";
import { System } from "system";
import { NesterComponent } from "shared/components";

export const ApplicationComponent = () => {
  useEffect(() => {
    System.load();
  }, []);

  const PROVIDERS = [
    InitialLoaderComponent,
    ConfigProvider,
    ProxyProvider,
    AssetsProvider,
    CoreLoaderComponent,
    AccountProvider,
    //|\\|//|\\|MODIFY/ONLY\BELOW|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|

    ModalProvider,

    //|\\|//|\\|MODIFY/ONLY\ABOVE|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
    RouterProvider,
  ];

  return <NesterComponent components={PROVIDERS} />;
};
