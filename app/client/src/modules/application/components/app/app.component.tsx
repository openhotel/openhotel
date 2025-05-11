import React, { useMemo } from "react";
import { ApplicationProvider } from "@openhotel/pixi-components";
import { ApplicationRender } from "shared/enums";

type Props = {
  children: React.ReactNode;
};

export const AppComponent: React.FC<Props> = ({ children }) => {
  const renderPreference = useMemo(
    () => localStorage.getItem("render-preference") ?? ApplicationRender.WEBGPU,
    [],
  ) as ApplicationRender;

  return useMemo(
    () => (
      <ApplicationProvider children={children} preference={renderPreference} />
    ),
    [children],
  );
};
