import React, { useMemo } from "react";
import { NesterComponent } from "../../shared/components";
import {
  FakeFurnitureProvider,
  FakeApiProvider,
  FakeConfigProvider,
  FakeProxyProvider,
  FakeAccountProvider,
} from ".";
import {
  AssetsProvider,
  CameraProvider,
  LanguageProvider,
  ModalProvider,
  SoundProvider,
  TasksProvider,
} from "../../shared/hooks";
import {
  CoreLoaderComponent,
  InitialLoaderComponent,
} from "../../modules/application";
import { DragContainerProvider } from "@openhotel/pixi-components";

type Props = {
  children: React.ReactNode;
};

export const FakeProviders: React.FC<Props> = ({ children }) => {
  const providers = useMemo(
    () => [
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      TasksProvider,
      InitialLoaderComponent,
      FakeConfigProvider,
      LanguageProvider,
      // ChangelogProvider,
      FakeProxyProvider,
      AssetsProvider,
      CoreLoaderComponent,
      // SafeWindowProvider,
      FakeAccountProvider,
      FakeApiProvider,
      FakeFurnitureProvider,
      CameraProvider, // Before 'ModalProvider' so 'ModalProvider' can use 'useCamera'
      SoundProvider,
      // ItemPlacePreviewProvider,
      // RouterProvider,
      DragContainerProvider,
      ModalProvider,
      // InfoProvider,
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      // PrivateRoomProvider,
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|
      //|\\|//|\\|//|\\|//|\\|//|\\|//|\\|//|\\|,
      // RouterProviderWrapper,
      () => children,
    ],
    [children],
  );

  return <NesterComponent components={providers} />;
};
