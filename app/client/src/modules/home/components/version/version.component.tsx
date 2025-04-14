import React, { useCallback, useMemo } from "react";
import { Cursor, EventMode } from "@openhotel/pixi-components";
import { TextComponent } from "shared/components";
import { useConfig } from "shared/hooks";
import { TEXT_BACKGROUND_BASE } from "shared/consts";

export const VersionComponent: React.FC = () => {
  const { getVersion, getConfig } = useConfig();

  const version = useMemo(() => getVersion(), [getVersion]);

  const onOpenGithubRelease = useCallback(() => {
    window.open(
      `https://github.com/openhotel/openhotel/releases/tag/v${getConfig().version}`,
      "_blank",
    );
  }, [getConfig]);

  return (
    <TextComponent
      text={version}
      eventMode={EventMode.STATIC}
      cursor={Cursor.POINTER}
      onPointerDown={onOpenGithubRelease}
      {...TEXT_BACKGROUND_BASE}
    />
  );
};
