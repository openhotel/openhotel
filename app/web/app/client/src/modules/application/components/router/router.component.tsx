import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import { NotFoundComponent } from "../not-found";
import { HomeComponent } from "modules/home";
import { RedirectComponent } from "shared/components";
import { Outlet } from "react-router";
import { ProvidersComponent } from "modules/application/components/providers";

import { WrapperLayoutComponent } from "modules/application";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProvidersComponent />,
    children: [
      {
        path: "/",
        element: (
          <WrapperLayoutComponent>
            <Outlet />
          </WrapperLayoutComponent>
        ),
        children: [
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
