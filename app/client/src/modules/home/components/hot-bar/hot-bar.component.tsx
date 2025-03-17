import React, { useEffect, useState } from "react";
import {
  ContainerComponent,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@oh/pixi-components";
import { HotBarItemsComponent } from "shared/components";
import { wait } from "shared/utils";
import { System } from "system";
import { TickerQueue } from "@oh/queue";
import { Modal } from "shared/enums";
import {
  CatalogComponent,
  ClubComponent,
  ConsoleComponent,
  InventoryComponent,
  NavigatorComponent,
  PurseComponent,
} from "modules/modals";

const DELTA_MULTIPLIER = 0.25;

export const HotBarComponent: React.FC = () => {
  const [yPosition, setYPosition] = useState<number>(50);

  useEffect(() => {
    wait(1000).then(() => {
      System.tasks.add({
        type: TickerQueue.DURATION,
        duration: 500,
        onFunc: (delta) => {
          setYPosition((y) => {
            const targetY = y - delta * DELTA_MULTIPLIER;

            if (0 >= targetY) return 0;
            return targetY;
          });
        },
      });
    });
  }, [setYPosition]);

  return (
    <ContainerComponent
      pivot={{
        y: 25,
      }}
      position={{
        y: yPosition,
      }}
    >
      <FlexContainerComponent align={FLEX_ALIGN.BOTTOM}>
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
