import React from "react";
import {
  ContainerComponent,
  EventMode,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  SpriteTextComponent,
} from "@oh/pixi-components";
import { System } from "system";
import { HotBarItemsComponent } from "shared/components";
import { BackgroundComponent } from "./components";

export const HomeComponent: React.FC = () => {
  const { username } = System.account.getAccount();
  return (
    <ContainerComponent sortableChildren={true}>
      <BackgroundComponent />
      <FlexContainerComponent
        align={FLEX_ALIGN.CENTER}
        justify={FLEX_JUSTIFY.CENTER}
        zIndex={10}
      >
        <SpriteTextComponent
          spriteSheet={"bold-font/bold-font.json"}
          text={`Welcome back ${username} 123!`}
          backgroundColor={1}
          eventMode={EventMode.STATIC}
        />
      </FlexContainerComponent>
      <FlexContainerComponent
        align={FLEX_ALIGN.BOTTOM}
        position={{
          y: -25,
        }}
      >
        <FlexContainerComponent
          justify={FLEX_JUSTIFY.SPACE_EVENLY}
          align={FLEX_ALIGN.CENTER}
          size={{
            height: 40,
          }}
        >
          <HotBarItemsComponent />
        </FlexContainerComponent>
      </FlexContainerComponent>
    </ContainerComponent>
  );
};
