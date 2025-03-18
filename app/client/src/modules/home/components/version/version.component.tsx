import React, { useCallback } from "react";
import { Cursor, EventMode } from "@oh/pixi-components";
import { TextComponent } from "shared/components";
import { useConfig } from "shared/hooks";

export const VersionComponent: React.FC = () => {
  const { getConfig } = useConfig();

  const { version } = getConfig();

  const onOpenGithubRelease = useCallback(() => {
    window.open(
      `https://github.com/openhotel/openhotel/releases/tag/v${version}`,
      "_blank",
    );
  }, [getConfig]);

  return (
    <TextComponent
      text={`${version}-alpha`}
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
