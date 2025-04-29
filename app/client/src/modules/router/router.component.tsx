import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import { ApplicationComponent } from "modules/application/application.component";
import { PhantomComponent } from "modules/phantom/phantom.component";

const router = createBrowserRouter([
  { path: "/phantom", Component: PhantomComponent },
  { path: "*", Component: ApplicationComponent },
]);

export const RouterComponent: React.FC<any> = ({ children }) => (
  //@ts-ignore
  <RouterProvider router={router}>${children}</RouterProvider>
);
