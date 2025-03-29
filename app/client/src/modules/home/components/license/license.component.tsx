import React, { useCallback } from "react";
import { Cursor, EventMode } from "@oh/pixi-components";
import { TextComponent } from "shared/components";

export const LicenseComponent: React.FC = () => {
  const onOpenLicense = useCallback(() => {
    window.open("https://creativecommons.org/licenses/by-nc-sa/4.0/", "_blank");
  }, []);
  return (
    <TextComponent
      text="CC BY-NC-SA 4.0"
      padding={{
        right: 0,
        left: 6,
        top: 3,
      }}
      eventMode={EventMode.STATIC}
      cursor={Cursor.POINTER}
      backgroundColor={1}
      backgroundAlpha={0.45}
      onPointerDown={onOpenLicense}
    />
  );
};
