import React from "react";
import { RouterComponent } from "../router";
import { Outlet } from "react-router";

export const ApplicationComponent = () => {
  return (
    <RouterComponent>
      <Outlet />
    </RouterComponent>
  );
};
