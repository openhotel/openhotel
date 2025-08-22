import React, { useMemo } from "react";
import {
  CoreLoaderComponent,
  InitialLoaderComponent,
  AppComponent,
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
  RouterProviderRenderer,
  CameraProvider,
  SafeWindowProvider,
  FurnitureProvider,
  SoundProvider,
  ItemPlacePreviewProvider,
  InfoProvider,
  ChangelogProvider,
  LanguageProvider,
  ApiProvider,
  GameProvider,
} from "shared/hooks";
import { NesterComponent } from "shared/components";

export const ApplicationComponent = () => {
  const providers = useMemo(
    () => [
      AppComponent,
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      TasksProvider,
      InitialLoaderComponent,
      ConfigProvider,
      LanguageProvider,
      ChangelogProvider,
      ProxyProvider,
      AssetsProvider,
      CoreLoaderComponent,
      SafeWindowProvider,
      AccountProvider,
      ApiProvider,
      FurnitureProvider,
      CameraProvider, // Before 'ModalProvider' so 'ModalProvider' can use 'useCamera'
      SoundProvider,
      GameProvider,
      ItemPlacePreviewProvider,
      RouterProvider,
      ModalProvider,
      InfoProvider,
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      PrivateRoomProvider,
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|,
      RouterProviderRenderer,
    ],
    [],
  );

  return <NesterComponent components={providers} />;
};
