import React, { useCallback, useMemo } from "react";
import { RouterContext } from "./router.context";
import { Route } from "shared/enums";
import { useRouterStore } from "./router.store";
import { HomeComponent } from "modules/home";
import { PrivateRoomComponent } from "modules/private-room";

type RouterProps = {
  children: React.ReactNode;
};

export const RouterProvider: React.FunctionComponent<RouterProps> = ({
  children,
}) => {
  const { navigate } = useRouterStore();

  const $navigate = useCallback(
    (route: Route, data: unknown) => {
      navigate(route, data);
    },
    [navigate],
  );

  return (
    <RouterContext.Provider
      value={{
        navigate: $navigate,
      }}
      children={children}
    />
  );
};

export const RouterProviderWrapper: React.FunctionComponent<
  RouterProps
> = () => {
  const { route, data } = useRouterStore();

  const RouteComponent = useMemo(
    () =>
      !isNaN(route)
        ? {
            [Route.HOME]: HomeComponent,
            [Route.PRIVATE_ROOM]: PrivateRoomComponent,
          }[route]
        : null,
    [route],
  );

  // @ts-ignore
  return RouteComponent ? <RouteComponent {...data} /> : null;
};
