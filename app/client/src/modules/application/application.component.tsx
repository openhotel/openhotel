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
import { ChangelogProvider } from "shared/hooks/changelog";
import { languageProvider } from "shared/hooks/language";

export const ApplicationComponent = () => {
  const providers = useMemo(
    () => [
      ApplicationProvider,
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      TasksProvider,
      InitialLoaderComponent,
      ConfigProvider,
      languageProvider,
      ChangelogProvider,
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
