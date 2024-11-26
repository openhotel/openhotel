import { AdminProvider, useUser } from "shared/hooks";
import React from "react";
import {
  ActionsComponent,
  HotelsComponent,
  TokensComponent,
  UsersComponent,
} from "./components";

export const AdminComponent = () => {
  const { user } = useUser();

  if (!user || !user?.admin) return null;

  return (
    <AdminProvider>
      <div>
        <h2>Admin</h2>
        <hr />
        <UsersComponent />
        <TokensComponent />
        <HotelsComponent />
        <ActionsComponent />
      </div>
    </AdminProvider>
  );
};
