import { AdminProvider, useUser } from "shared/hooks";
import React from "react";
import {
  AdminTokensComponent,
  AdminActionsComponent,
  AdminThirdPartyComponent,
} from "./components";

export const AdminComponent = () => {
  const { user } = useUser();

  if (!user || !user?.admin) return null;

  return (
    <AdminProvider>
      <div>
        <h2>Admin</h2>
        <hr />
        <AdminTokensComponent />
        <hr />
        <AdminThirdPartyComponent />
        <hr />
        <AdminActionsComponent />
      </div>
    </AdminProvider>
  );
};
