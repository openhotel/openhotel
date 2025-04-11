import React, { useCallback } from "react";
import {
  ContainerComponent,
  FLEX_ALIGN,
  FlexContainerComponent,
} from "@openhotel/pixi-components";
import {
  BackgroundComponent,
  ContributorsComponent,
  HotBarComponent,
  LicenseComponent,
  LogoComponent,
  VignetteTransitionComponent,
} from "./components";
import { useModal } from "shared/hooks";
import { Modal } from "shared/enums";
import { VersionComponent } from "shared/components";

export const HomeComponent: React.FC = () => {
  const { openModal, isModalOpen } = useModal();

  const onDone = useCallback(() => {
    if (isModalOpen(Modal.NAVIGATOR)) return;
    openModal(Modal.NAVIGATOR);
  }, [openModal]);

  return (
    <ContainerComponent sortableChildren={true}>
      <BackgroundComponent />

      <VignetteTransitionComponent />
      <LogoComponent />
      <HotBarComponent onDone={onDone} />

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
  );
};
