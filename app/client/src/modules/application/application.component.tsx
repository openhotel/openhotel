import React, { useMemo } from "react";
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
  PrivateRoomProvider,
  RouterProviderWrapper,
  CameraProvider,
  SafeWindowProvider,
} from "shared/hooks";
import { NesterComponent } from "shared/components";
import { FurnitureProvider } from "shared/hooks";
import { InfoProvider } from "shared/hooks/info";
import { ApplicationProvider } from "@openhotel/pixi-components";

export const ApplicationComponent = () => {
  const providers = useMemo(
    () => [
      ApplicationProvider,
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      TasksProvider,
      InitialLoaderComponent,
      ConfigProvider,
      ProxyProvider,
      AssetsProvider,
      CoreLoaderComponent,
      SafeWindowProvider,
      AccountProvider,
      FurnitureProvider,
      CameraProvider, // Before 'ModalProvider' so 'ModalProvider' can use 'useCamera'
      ModalProvider,
      RouterProvider,
      InfoProvider,
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      PrivateRoomProvider,
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|,
      RouterProviderWrapper,
    ],
    [],
  );

  return <NesterComponent components={providers} />;
};
