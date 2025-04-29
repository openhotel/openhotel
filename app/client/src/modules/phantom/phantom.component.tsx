import React, { useMemo } from "react";
import { CoreLoaderComponent } from "modules/application";
import {
  AssetsProvider,
  ConfigProvider,
  FurnitureProvider,
} from "shared/hooks";
import { NesterComponent } from "shared/components";
import { ApplicationProvider } from "@openhotel/pixi-components";
import { PhantomProvider, RenderComponent } from ".";

export const PhantomComponent = () => {
  const providers = useMemo(
    () => [
      ({ children }) => (
        <ApplicationProvider scale={1} preference="webgl" children={children} />
      ),
      // TasksProvider,
      ConfigProvider,
      PhantomProvider,
      AssetsProvider,
      CoreLoaderComponent,
      FurnitureProvider,
      RenderComponent,
    ],
    [],
  );

  return <NesterComponent components={providers} />;
};
