import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import React from "react";
import { NotFoundComponent } from "../not-found";
import { LoginComponent } from "modules/login";
import { RegisterComponent } from "modules/register";
import { HomeComponent } from "modules/home";
import { RedirectComponent } from "shared/components";
import { VerifyComponent } from "modules/verify";
import { LogoutComponent } from "modules/logout";
import { AccountComponent } from "modules/account";
import {
  MainLayoutComponent,
  CardLayoutComponent,
  AccountItemComponent,
  NavItemComponent,
  HotelIconComponent,
} from "@oh/components";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        element: <CardLayoutComponent children={<LoginComponent />} />,
        path: "/login",
      },
      {
        element: <CardLayoutComponent children={<RegisterComponent />} />,
        path: "/register",
      },
      {
        element: <CardLayoutComponent children={<VerifyComponent />} />,
        path: "/verify",
      },
      {
        path: "/logout",
        Component: () => <LogoutComponent />,
      },
      {
        element: <MainLayoutComponent children={<Outlet />} />,
        path: "/account",
        children: [
          {
            path: "",
            Component: () => <AccountComponent />,
          },
        ],
      },
      {
        path: "/",
        Component: () => <HomeComponent />,
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
  <RouterProvider router={router}>${children}</RouterProvider>
);
