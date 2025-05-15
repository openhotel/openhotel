import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ContainerComponent,
  FLEX_ALIGN,
  FlexContainerComponent,
  Size,
  useEvents,
} from "@openhotel/pixi-components";
import {
  BackgroundComponent,
  ContributorsComponent,
  HotBarComponent,
  LicenseComponent,
  LogoComponent,
  VersionComponent,
  VignetteTransitionComponent,
} from "./components";
import { useModal, useSafeWindow } from "shared/hooks";
import { InternalEvent, Modal } from "shared/enums";
import { GameContainer } from "modules/games";

export const HomeComponent: React.FC = () => {
  const { openModal, isModalOpen } = useModal();
  const { on } = useEvents();
  const { getSafeXPosition, getSafeSize } = useSafeWindow();

  const [safeWindowResize, setSafeWindowResize] = useState<Size>(getSafeSize());
  const [safeXPosition, setSafeXPosition] =
    useState<number>(getSafeXPosition());

  const onDone = useCallback(() => {
    if (isModalOpen(Modal.NAVIGATOR)) return;
    openModal(Modal.NAVIGATOR);
  }, [openModal]);

  useEffect(() => {
    const removeOnSafeResize = on(
      InternalEvent.SAFE_RESIZE,
      setSafeWindowResize,
    );
    const removeOnSafePositionX = on(
      InternalEvent.SAFE_POSITION_X,
      setSafeXPosition,
    );

    return () => {
      removeOnSafeResize();
      removeOnSafePositionX();
    };
  }, [on, setSafeWindowResize, setSafeXPosition]);

  // DO NOT MERGE - GameContainer tests
  return useMemo(
    () => (
      <ContainerComponent sortableChildren={true}>
        <BackgroundComponent />

        <VignetteTransitionComponent />
        <ContainerComponent pivot={{ x: safeXPosition }}>
          <LogoComponent />
          <HotBarComponent onDone={onDone} width={safeWindowResize.width} />

          <FlexContainerComponent
            align={FLEX_ALIGN.BOTTOM}
            pivot={{
              x: -5,
              y: 55,
            }}
          >
            <FlexContainerComponent direction="y">
              <VersionComponent />
              <LicenseComponent />
              <ContributorsComponent />
            </FlexContainerComponent>
          </FlexContainerComponent>
        </ContainerComponent>
        <ContainerComponent position={{ x: 100, y: 120 }}>
          <GameContainer gameId={"template"} />
        </ContainerComponent>
      </ContainerComponent>
    ),
    [safeXPosition, onDone, safeWindowResize],
  );
};
