import React, { useCallback, useEffect, useMemo } from "react";
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
  const { navigate, route } = useRouterStore();

  const $navigate = useCallback(
    (route: Route, data: unknown) => {
      navigate(route, data);
    },
    [navigate],
  );

  const getRoute = useCallback(() => route, [route]);

  return (
    <RouterContext.Provider
      value={{
        getRoute,
        navigate: $navigate,
      }}
      children={children}
    />
  );
};

export const RouterProviderWrapper: React.FunctionComponent<
  RouterProps
> = () => {
  const { route, data, navigate } = useRouterStore();

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

  useEffect(() => {
    if (route) return;
    //if there's not route in some time, load home to prevent locking
    const timeout = setTimeout(() => {
      navigate(Route.HOME);
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [route]);

  // @ts-ignore
  return RouteComponent ? <RouteComponent {...data} /> : null;
};
