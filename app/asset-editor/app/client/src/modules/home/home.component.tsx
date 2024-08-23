import React from "react";
import { ContainerComponent } from "shared/components";

export const HomeComponent: React.FC = () => {
  return (
    <ContainerComponent>
      <p>Welcome!</p>
      <span>We expect you know what are you doing.</span>
    </ContainerComponent>
  );
};
