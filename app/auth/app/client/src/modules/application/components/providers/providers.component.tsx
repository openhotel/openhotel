import { Outlet } from "react-router";
import { UserProvider } from "shared/hooks";
import React from "react";

export const ProvidersComponent = () => {
  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
};
