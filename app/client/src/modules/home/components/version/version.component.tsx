import React, { useCallback } from "react";
import { Cursor, EventMode } from "@oh/pixi-components";
import { TextComponent } from "shared/components";
import { useConfig } from "shared/hooks";

export const VersionComponent: React.FC = () => {
  const { config } = useConfig();

  const onOpenGithubRelease = useCallback(() => {
    config.version = "0.5.33";
    window.open(
      `https://github.com/openhotel/openhotel/releases/tag/v${config.version}`,
      "_blank",
    );
  }, [config]);

  return (
    <TextComponent
      text={`${config.version}-alpha`}
      padding={{
        right: 0,
        left: 6,
        top: 3,
      }}
      eventMode={EventMode.STATIC}
      cursor={Cursor.POINTER}
      backgroundColor={1}
      backgroundAlpha={0.45}
      onPointerDown={onOpenGithubRelease}
    />
  );
};
