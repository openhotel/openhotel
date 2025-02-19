import { AdminProvider, useUser } from "shared/hooks";
import React from "react";
import {
  AdminTokensComponent,
  AdminActionsComponent,
  AdminAppsComponent,
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
        <AdminAppsComponent />
        <hr />
        <AdminActionsComponent />
      </div>
    </AdminProvider>
  );
};
