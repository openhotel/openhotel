import React, { useCallback } from "react";
import { Route } from "../../../shared/enums";
import { RouterContext, useRouterStore } from "../../../shared/hooks";

type RouterProps = {
  children: React.ReactNode;
};

export const FakeRouterProvider: React.FunctionComponent<RouterProps> = ({
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
