import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import { NotFoundComponent } from "../not-found";
import { LoginComponent } from "modules/login";
import { RegisterComponent } from "modules/register";
import { HomeComponent, HotelsComponent } from "modules/home";
import { RedirectComponent } from "shared/components";
import { LogoutComponent } from "modules/logout";
import { CardLayoutComponent } from "modules/application/components/card-layout";
import { ConnectionComponent } from "modules/connection";
import { Outlet } from "react-router";
import { VerifyComponent } from "modules/verify";
import { ChangePasswordComponent } from "modules/change-password";
import { RecoverPasswordComponent } from "modules/recover-password";
import { ProvidersComponent } from "modules/application/components/providers";
import {
  AccountComponent,
  ConnectionsComponent,
  DeleteComponent,
  GithubComponent,
  MyHotelsComponent,
  SessionsComponent,
} from "modules/account";
import {
  AdminClaimComponent,
  AdminComponent,
  AdminHotelsComponent,
  AdminUsersComponent,
  AnalyticsComponent,
} from "modules/admin";
import { AdminProvider, CaptchaV2Provider } from "shared/hooks";
import { WrapperLayoutComponent } from "modules/application";
import { AdminBackupsComponent } from "modules/admin/components/backups";
import { AppsComponent } from "modules/apps";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProvidersComponent />,
    children: [
      {
        element: (
          <CaptchaV2Provider>
            <CardLayoutComponent mih="20rem">
              <LoginComponent />
            </CardLayoutComponent>
          </CaptchaV2Provider>
        ),
        path: "/login",
      },
      {
        element: (
          <CaptchaV2Provider>
            <CardLayoutComponent mih="20rem">
              <RecoverPasswordComponent />
            </CardLayoutComponent>
          </CaptchaV2Provider>
        ),
        path: "/recover-password",
      },
      {
        element: (
          <CaptchaV2Provider>
            <CardLayoutComponent mih="20rem">
              <ChangePasswordComponent />
            </CardLayoutComponent>
          </CaptchaV2Provider>
        ),
        path: "/change-password",
      },
      {
        element: (
          <CaptchaV2Provider>
            <CardLayoutComponent mih="30rem">
              <RegisterComponent />
            </CardLayoutComponent>
          </CaptchaV2Provider>
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
      {
        element: <AppsComponent />,
        path: "/apps",
      },
      { path: "/verify", element: <VerifyComponent /> },
      //pages
      {
        path: "/account",
        element: (
          <WrapperLayoutComponent>
            <Outlet />
          </WrapperLayoutComponent>
        ),
        children: [
          {
            path: "",
            element: <AccountComponent />,
          },
          {
            path: "my-hotels",
            element: <MyHotelsComponent />,
          },
          {
            path: "connections",
            element: <ConnectionsComponent />,
          },
          {
            path: "github",
            element: <GithubComponent />,
          },
          {
            path: "sessions",
            element: <SessionsComponent />,
          },
          {
            path: "delete",
            element: <DeleteComponent />,
          },
        ],
      },
      {
        path: "/admin",
        element: (
          <WrapperLayoutComponent>
            <AdminProvider>
              <Outlet />
            </AdminProvider>
          </WrapperLayoutComponent>
        ),
        children: [
          {
            path: "",
            element: <AdminComponent />,
          },
          {
            path: "hotels",
            element: <AdminHotelsComponent />,
          },
          {
            path: "users",
            element: <AdminUsersComponent />,
          },
          {
            path: "backups",
            element: <AdminBackupsComponent />,
          },
          {
            path: "claim",
            element: <AdminClaimComponent />,
          },
          {
            path: "analytics",
            element: <AnalyticsComponent />,
          },
        ],
      },
      {
        path: "/",
        element: (
          <WrapperLayoutComponent>
            <Outlet />
          </WrapperLayoutComponent>
        ),
        children: [
          {
            path: "hotels",
            element: <HotelsComponent />,
          },
          {
            path: "",
            element: <HomeComponent />,
          },
        ],
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
