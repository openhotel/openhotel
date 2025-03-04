import React, { PropsWithChildren, useEffect, useState } from "react";
import { SpriteSheetEnum } from "shared/enums";
import { useTextures } from "@oh/pixi-components";

type Props = {} & PropsWithChildren;

export const InitialLoaderComponent: React.FC<Props> = ({ children }) => {
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

  return isLoaded ? children : null;
};
