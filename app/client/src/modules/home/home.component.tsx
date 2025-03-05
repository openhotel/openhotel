import React from "react";
import { ContainerComponent } from "@oh/pixi-components";
import {
  BackgroundComponent,
  HotBarComponent,
  VignetteTransitionComponent,
  LogoComponent,
  ContributorsComponent,
} from "./components";

export const HomeComponent: React.FC = () => {
  return (
    <ContainerComponent sortableChildren={true}>
      <BackgroundComponent />
      <VignetteTransitionComponent />
      <LogoComponent />
      <HotBarComponent />
      <ContributorsComponent />
    </ContainerComponent>
  );
};
