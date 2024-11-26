import React from "react";
import {
  OtpComponent,
  ConnectionsComponent,
  LicenseComponent,
  AccountComponent,
  AdminComponent,
  ActionsComponent,
  BskyComponent,
} from "./components";
import { Outlet } from "react-router-dom";
import { useAccount, UserProvider } from "shared/hooks";
import { RedirectComponent } from "shared/components";

export const HomeComponent: React.FC = () => {
  const { isLogged } = useAccount();

  if (isLogged === null) return <div>Loading...</div>;
  if (!isLogged) return <RedirectComponent to="/login" />;

  return (
    <UserProvider>
      <div>
        <AccountComponent />
        <Outlet />
        <OtpComponent />
        <LicenseComponent />
        <ConnectionsComponent />
        <ActionsComponent />
        <BskyComponent />
        <AdminComponent />
      </div>
    </UserProvider>
  );
};
