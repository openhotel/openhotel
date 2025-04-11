import React, { useCallback, useMemo } from "react";
import { Cursor, EventMode } from "@openhotel/pixi-components";
import { TextComponent } from "shared/components";
import { useConfig } from "shared/hooks";
import { TEXT_PADDING } from "shared/consts";

export const VersionComponent: React.FC = () => {
  const { getConfig } = useConfig();

  const version = useMemo(() => getConfig?.()?.version, [getConfig]);

  const onOpenGithubRelease = useCallback(() => {
    window.open(
      `https://github.com/openhotel/openhotel/releases/tag/v${version}`,
      "_blank",
    );
  }, [getConfig]);

  return (
    <TextComponent
      text={`${version}-alpha`}
      eventMode={EventMode.STATIC}
      cursor={Cursor.POINTER}
      backgroundColor={0}
      backgroundAlpha={0.25}
      color={0xffffff}
      padding={TEXT_PADDING}
      onPointerDown={onOpenGithubRelease}
    />
  );
};
