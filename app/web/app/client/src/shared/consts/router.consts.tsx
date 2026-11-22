import React, { lazy, Suspense } from "react";
import { Navigate, RouteObject } from "react-router";

import { CoreLayoutComponent } from "shared/components/layouts/core-layout.component.tsx";
import { HomeLayoutComponent } from "shared/components/layouts/home-layout.component.tsx";

const SetupComponent = lazy(() =>
  import("modules/setup/setup.component").then((m) => ({
    default: m.SetupComponent,
  })),
);
const HomeComponent = lazy(() =>
  import("modules/home/home.component.tsx").then((m) => ({
    default: m.HomeComponent,
  })),
);

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={null}>{element}</Suspense>
);

export const ROUTER_LIST: RouteObject[] = [
  {
    element: <CoreLayoutComponent />,
    children: [
      {
        element: <HomeLayoutComponent />,
        children: [
          {
            index: true,
            element: withSuspense(<HomeComponent />),
          },
        ],
      },
      {
        element: <HomeLayoutComponent />,
        path: "setup",
        children: [
          {
            index: true,
            element: withSuspense(<SetupComponent />),
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
];
