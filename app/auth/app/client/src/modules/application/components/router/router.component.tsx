import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import { NotFoundComponent } from "../not-found";
import { LoginComponent } from "modules/login";
import { RegisterComponent } from "modules/register";
import {
  AccountComponent,
  AdminComponent,
  BskyComponent,
  ConnectionsComponent,
  HomeComponent,
  HomeNavigatorComponent,
  HotelsComponent,
} from "modules/home";
import { RedirectComponent } from "shared/components";
import { LogoutComponent } from "modules/logout";
import { CardLayoutComponent } from "modules/application/components/card-layout";
import { MainLayoutComponent } from "@oh/components";
import { ConnectionComponent, PingComponent } from "modules/connection";
import { ClaimAdminComponent } from "modules/admin";
import { RecoverPasswordComponent } from "modules/recover-password";
import { ChangePasswordComponent } from "modules/change-password";
import { VerifyComponent } from "modules/verify";
import { ProvidersComponent } from "modules/application/components/providers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProvidersComponent />,
    children: [
      {
        element: (
          <CardLayoutComponent mih="20rem">
            <LoginComponent />
          </CardLayoutComponent>
        ),
        path: "/login",
      },
      {
        element: (
          <CardLayoutComponent mih="20rem">
            <RecoverPasswordComponent />
          </CardLayoutComponent>
        ),
        path: "/recover-password",
      },
      {
        element: (
          <CardLayoutComponent mih="20rem">
            <ChangePasswordComponent />
          </CardLayoutComponent>
        ),
        path: "/change-password",
      },
      {
        element: (
          <CardLayoutComponent mih="30rem">
            <RegisterComponent />
          </CardLayoutComponent>
        ),
        path: "/register",
      },
      {
        path: "/logout",
        Component: () => <LogoutComponent />,
      },
      {
        element: (
          <CardLayoutComponent>
            <ConnectionComponent />
          </CardLayoutComponent>
        ),
        path: "/connection",
      },
      { path: "/verify", element: <VerifyComponent /> },
      { path: "/ping", element: <PingComponent /> },
      //pages
      {
        path: "/account",
        element: (
          <MainLayoutComponent
            children={<AccountComponent />}
            navigatorChildren={<HomeNavigatorComponent />}
          />
        ),
      },
      {
        path: "/account/hotels",
        element: (
          <MainLayoutComponent
            children={<HotelsComponent />}
            navigatorChildren={<HomeNavigatorComponent />}
          />
        ),
      },
      {
        path: "/account/connections",
        element: (
          <MainLayoutComponent
            children={<ConnectionsComponent />}
            navigatorChildren={<HomeNavigatorComponent />}
          />
        ),
      },
      {
        path: "/account/bsky",
        element: (
          <MainLayoutComponent
            children={<BskyComponent />}
            navigatorChildren={<HomeNavigatorComponent />}
          />
        ),
      },
      {
        path: "/admin",
        element: (
          <MainLayoutComponent
            children={<AdminComponent />}
            navigatorChildren={<HomeNavigatorComponent />}
          />
        ),
      },
      { path: "/admin/claim", element: <ClaimAdminComponent /> },
      {
        path: "/",
        element: (
          <MainLayoutComponent
            children={<HomeComponent />}
            navigatorChildren={<HomeNavigatorComponent />}
          />
        ),
      },
      {
        path: "/404",
        Component: () => <NotFoundComponent />,
      },
      { path: "*", Component: () => <RedirectComponent to="/404" /> },
    ],
  },
]);

export const RouterComponent: React.FC<any> = ({ children }) => (
  //@ts-ignore
  <RouterProvider router={router}>${children}</RouterProvider>
);
