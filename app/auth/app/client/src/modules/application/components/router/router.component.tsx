import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import { NotFoundComponent } from "../not-found";
import { LoginComponent } from "modules/login";
import { RegisterComponent } from "modules/register";
import { HomeComponent, HomeNavigatorComponent } from "modules/home";
import { RedirectComponent } from "shared/components";
import { LogoutComponent } from "modules/logout";
import { CardLayoutComponent } from "modules/application/components/card-layout";
import { MainLayoutComponent } from "@oh/components";
import { ConnectionComponent, PingComponent } from "modules/connection";
import { AdminComponent } from "modules/admin";
import { RecoverPasswordComponent } from "modules/recover-password";
import { ChangePasswordComponent } from "modules/change-password";
import { VerifyComponent } from "modules/verify";

const router = createBrowserRouter([
  {
    path: "/",
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
      // {
      //   element: <CardLayoutComponent children={<VerifyComponent />} />,
      //   path: "/verify",
      // },
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
      // {
      //   element: <MainLayoutComponent children={<Outlet />} />,
      //   path: "/account",
      //   children: [
      //     {
      //       path: "",
      //       Component: () => <AccountComponent />,
      //     },
      //   ],
      // },
      { path: "/verify", element: <VerifyComponent /> },
      { path: "/ping", element: <PingComponent /> },
      { path: "/admin", element: <AdminComponent /> },
      {
        path: "/home",
        element: (
          <MainLayoutComponent
            children={<HomeComponent />}
            navigatorChildren={<HomeNavigatorComponent />}
          />
        ),
      },
      { path: "/", element: <RedirectComponent to="/home" /> },
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
