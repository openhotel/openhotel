import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { LoaderComponent } from "modules/application";
import { SpriteSheetEnum, TextureEnum } from "shared/enums";
import { useTextures } from "@oh/pixi-components";

type AddItemsProps = {
  startLabel: string;
  endLabel: string;

  prefix?: string;
  suffix?: string;
  items: string[];

  func: (props: unknown) => Promise<unknown>;
};

type LoaderState = {
  addItems: (...data: AddItemsProps[]) => void;
  currentText: string;
};

const LoaderContext = React.createContext<LoaderState>(undefined);

type LoaderProps = {
  children: ReactNode;
};

export const LoaderProvider: React.FunctionComponent<LoaderProps> = ({
  children,
}) => {
  const [currentText, setCurrentText] = useState<string>("Loading...");
  const [isLoading, setLoading] = useState<boolean>(true);
  const { getSpriteSheet, getTexture } = useTextures();

  const addItems = useCallback(
    async (...data: AddItemsProps[]) => {
      setLoading(true);
      for (const {
        items,
        func,
        startLabel,
        endLabel,
        prefix,
        suffix,
      } of data) {
        setCurrentText(startLabel);
        for (const item of items) {
          setCurrentText(`${prefix} ${item.split(".")[0]} ${suffix}`);
          await func(item);
        }
        setCurrentText(endLabel);
      }
      setLoading(false);
    },
    [setLoading, setCurrentText],
  );

  //Load first time the base textures
  useEffect(() => {
    const spriteSheets = Object.values(SpriteSheetEnum);

    const spriteSheetsLoader: AddItemsProps = {
      items: spriteSheets,
      startLabel: "Loading sprite-sheets",
      endLabel: "Sprite-sheets loaded!",
      prefix: "Loading",
      suffix: "sprite-sheet",
      func: getSpriteSheet,
    };

    const textures = Object.values(TextureEnum);
    const texturesLoader = {
      items: textures,
      startLabel: "Loading textures",
      endLabel: "Textures loaded!",
      prefix: "Loading",
      suffix: "texture",
      func: (texture: string) => getTexture({ texture }),
    };

    addItems(spriteSheetsLoader, texturesLoader);
  }, [getSpriteSheet, getTexture]);

  return (
    <LoaderContext.Provider
      value={{
        addItems,
        currentText,
      }}
      children={isLoading ? <LoaderComponent /> : children}
    />
  );
};

export const useLoader = (): LoaderState => useContext(LoaderContext);
