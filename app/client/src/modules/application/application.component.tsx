import React from "react";
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
  TasksProvider,
} from "shared/hooks";
import { NesterComponent } from "shared/components";

export const ApplicationComponent = () => {
  const PROVIDERS = [
    TasksProvider,
    //
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
