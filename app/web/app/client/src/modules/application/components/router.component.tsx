import { createBrowserRouter, RouterProvider } from "react-router";
import React from "react";

import { ROUTER_LIST } from "shared/consts/router.consts.tsx";

const router = createBrowserRouter(ROUTER_LIST);

export const RouterComponent: React.FC<any> = ({ children }) => (
  //@ts-ignore
  <RouterProvider router={router}>${children}</RouterProvider>
);
