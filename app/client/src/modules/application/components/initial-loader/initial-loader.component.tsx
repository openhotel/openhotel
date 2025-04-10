import React, { PropsWithChildren, useEffect, useState } from "react";
import { SpriteSheetEnum } from "shared/enums";
import { useTextures } from "@oh/pixi-components";

type Props = {} & PropsWithChildren;

export const InitialLoaderComponent: React.FC<Props> = ({ children }) => {
  const { loadSpriteSheet } = useTextures();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      loadSpriteSheet(SpriteSheetEnum.DEFAULT_FONT),
      loadSpriteSheet(SpriteSheetEnum.BOLD_FONT),
    ]).then(() => {
      setIsLoaded(true);
    });
  }, [loadSpriteSheet, setIsLoaded]);

  return isLoaded ? children : null;
};
