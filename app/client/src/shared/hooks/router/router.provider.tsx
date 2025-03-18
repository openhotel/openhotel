import React, { ReactNode } from "react";
import { RouterContext } from "./router.context";
import { HomeComponent } from "modules/home";

type RouterProps = {
  children: ReactNode;
};

export const RouterProvider: React.FunctionComponent<RouterProps> = ({
  children,
}) => {
  return <RouterContext.Provider value={{}} children={<HomeComponent />} />;
};
