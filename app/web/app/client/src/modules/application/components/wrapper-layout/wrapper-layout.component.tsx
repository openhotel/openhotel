import React from "react";
import { MainLayoutComponent } from "@openhotel/web-components";
import { HeaderComponent } from "modules/account";

type Props = {
  children: React.ReactNode;
};

export const WrapperLayoutComponent = ({ children }: Props) => {
  return (
    <MainLayoutComponent
      children={children}
      headerChildren={<HeaderComponent />}
    />
  );
};
