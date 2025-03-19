import React, { useCallback } from "react";
import {
  ContainerComponent,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@oh/pixi-components";
import {
  BackgroundComponent,
  ContributorsComponent,
  HotBarComponent,
  LicenseComponent,
  LogoComponent,
  VersionComponent,
  VignetteTransitionComponent,
} from "./components";
import { useModal } from "shared/hooks";
import { Modal } from "shared/enums";
import { NavigatorComponent } from "modules/modals";

export const HomeComponent: React.FC = () => {
  const { openModal } = useModal();

  const onDone = useCallback(() => {
    openModal(Modal.NAVIGATOR, NavigatorComponent);
  }, [openModal]);

  return (
    <ContainerComponent sortableChildren={true}>
      <BackgroundComponent />

      <VignetteTransitionComponent onDone={onDone} />
      <LogoComponent />
      <HotBarComponent />

      <FlexContainerComponent
        align={FLEX_ALIGN.BOTTOM}
        pivot={{
          x: -5,
          y: 55,
        }}
      >
        <FlexContainerComponent
          justify={FLEX_JUSTIFY.SPACE_EVENLY}
          direction="y"
          size={{
            height: 39,
          }}
        >
          <VersionComponent />
          <LicenseComponent />
          <ContributorsComponent />
        </FlexContainerComponent>
      </FlexContainerComponent>
    </ContainerComponent>
  );
};
