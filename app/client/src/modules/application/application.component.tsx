import React, { useEffect, useState } from "react";
import { SpriteTextComponent, useTextures } from "@oh/pixi-components";
import { LoaderProvider } from "shared/hooks";
import { SpriteSheetEnum } from "shared/enums";

export const ApplicationComponent = () => {
  const { getSpriteSheet } = useTextures();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      getSpriteSheet(SpriteSheetEnum.DEFAULT_FONT),
      getSpriteSheet(SpriteSheetEnum.BOLD_FONT),
    ]).then(() => {
      setIsLoaded(true);
    });
  }, [getSpriteSheet, setIsLoaded]);

  if (!isLoaded) return null;

  return (
    <LoaderProvider>
      <SpriteTextComponent
        spriteSheet={"bold-font/bold-font.json"}
        text={"test"}
        tint={0xff00ff}
      />
      <SpriteTextComponent
        spriteSheet={"default-font/default-font.json"}
        text={"test"}
        position={{ x: 20, y: 0 }}
        tint={0xff00ff}
      />
    </LoaderProvider>
  );
};
