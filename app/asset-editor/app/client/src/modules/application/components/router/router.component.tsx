import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React from "react";
import { LayoutComponent } from "../layout";
import { NotFoundComponent } from "../not-found";
import { HomeComponent } from "modules/home";
import { RedirectComponent } from "shared/components";
import { CreateFurnitureComponent } from "modules/furniture";

const router = createBrowserRouter([
  {
    element: <LayoutComponent />,
    path: "/",
    children: [
      {
        path: "/",
        Component: () => <HomeComponent />,
      },
      {
        path: "/furniture/create",
        Component: () => <CreateFurnitureComponent />,
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
  // @ts-ignore
  <RouterProvider router={router}>${children}</RouterProvider>
);
