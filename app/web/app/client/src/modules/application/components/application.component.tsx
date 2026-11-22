import React from "react";
import { Outlet } from "react-router";
import { RouterComponent } from "modules/application/components/router.component.tsx";

export const ApplicationComponent = () => {
  return (
    <RouterComponent>
      <Outlet />
    </RouterComponent>
  );
};
