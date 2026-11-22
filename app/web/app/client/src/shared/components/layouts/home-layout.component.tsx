import React from "react";
import { Outlet } from "react-router";

export const HomeLayoutComponent: React.FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};
