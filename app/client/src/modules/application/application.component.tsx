import React from "react";
import { SpriteTextComponent } from "@oh/pixi-components";
import {
  CoreLoaderComponent,
  InitialLoaderComponent,
} from "modules/application";
import { ConfigProvider, ProxyProvider } from "shared/hooks";

export const ApplicationComponent = () => {
  return (
    <InitialLoaderComponent>
      <ConfigProvider>
        <ProxyProvider>
          <CoreLoaderComponent>
            <SpriteTextComponent
              spriteSheet={"bold-font/bold-font.json"}
              text={"test"}
              tint={0xff00ff}
            />
          </CoreLoaderComponent>
        </ProxyProvider>
      </ConfigProvider>
    </InitialLoaderComponent>
  );
};
