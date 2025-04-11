import React, { useCallback } from "react";
import { Cursor, EventMode } from "@openhotel/pixi-components";
import { TextComponent } from "shared/components";
import { TEXT_PADDING } from "shared/consts";

export const LicenseComponent: React.FC = () => {
  const onOpenLicense = useCallback(() => {
    window.open("https://creativecommons.org/licenses/by-nc-sa/4.0/", "_blank");
  }, []);
  return (
    <TextComponent
      text="CC BY-NC-SA 4.0"
      padding={TEXT_PADDING}
      eventMode={EventMode.STATIC}
      cursor={Cursor.POINTER}
      backgroundColor={1}
      backgroundAlpha={0.25}
      onPointerDown={onOpenLicense}
    />
  );
};
