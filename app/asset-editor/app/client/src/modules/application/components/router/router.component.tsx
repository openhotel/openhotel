import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React from "react";
import { LayoutComponent } from "../layout";
import { NotFoundComponent } from "../not-found";
import { HomeComponent } from "modules/home";
import { FileManagerComponent } from "modules/file-manager";
import { RedirectComponent } from "shared/components";
import { SpriteSheetsComponent } from "modules/sprite-sheets";
import { FurnitureComponent } from "modules/furniture";

const router = createBrowserRouter([
  {
    element: <LayoutComponent />,
    path: "/",
    children: [
      {
        path: "/furniture",
        element: <FurnitureComponent />,
      },
      {
        path: "/sprite-sheets",
        element: <SpriteSheetsComponent />,
      },
      {
        path: "/file-manager",
        element: <FileManagerComponent />,
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
