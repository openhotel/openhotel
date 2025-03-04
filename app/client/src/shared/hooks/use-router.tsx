import React, { useContext } from "react";
import { HomeComponent } from "modules/home";

type RouterState = {};

const RouterContext = React.createContext<RouterState>(undefined);

type RouterProps = {};

export const RouterProvider: React.FunctionComponent<RouterProps> = () => {
  return <RouterContext.Provider value={{}} children={<HomeComponent />} />;
};

export const useRouter = (): RouterState => useContext(RouterContext);
