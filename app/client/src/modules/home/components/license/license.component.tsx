import React, { useCallback, useMemo } from "react";
import { Cursor, EventMode } from "@openhotel/pixi-components";
import { TextComponent } from "shared/components";
import { TEXT_BACKGROUND_BASE } from "shared/consts";

export const LicenseComponent: React.FC = () => {
  const onOpenLicense = useCallback(() => {
    window.open("https://creativecommons.org/licenses/by-nc-sa/4.0/", "_blank");
  }, []);
  return useMemo(
    () => (
      <TextComponent
        text="CC BY-NC-SA 4.0"
        eventMode={EventMode.STATIC}
        cursor={Cursor.POINTER}
        onPointerDown={onOpenLicense}
        {...TEXT_BACKGROUND_BASE}
      />
    ),
    [onOpenLicense],
  );
};
