import React, { ReactNode, useCallback, useContext, useState } from "react";
import { FurnitureData, SpriteSheet } from "shared/types";
import { parseFurniture } from "shared/utils/furniture.utils";
import { setObject } from "shared/utils";

type Data = {
  sprite: string;
  sheet: SpriteSheet;
  furniture: FurnitureData;
};

type FurnitureState = {
  setData: (data: Data) => void;
  data: Data;

  setFurniture: (furniture: FurnitureData) => void;

  onChangeFurniture: (ket: string) => (event: unknown) => void;
};

const FurnitureContext = React.createContext<FurnitureState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const FurnitureProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const [data, $setData] = useState<{
    sprite: string;
    sheet: SpriteSheet;
    furniture: FurnitureData;
  }>(null);

  //TODO check data if is correct formed or if it needs information

  const setData = useCallback(
    (data) => {
      $setData(
        data
          ? {
              ...data,
              furniture: parseFurniture(data.furniture, data.sheet),
            }
          : null,
      );
    },
    [$setData],
  );

  const setFurniture = useCallback(
    (furniture: FurnitureData) => {
      setData({ ...data, furniture });
    },
    [data, setData],
  );

  const onChangeFurniture = useCallback(
    (key: string) => (event) => {
      setFurniture(setObject(data?.furniture, key, event.target.value));
    },
    [setFurniture, data],
  );

  return (
    <FurnitureContext.Provider
      value={{
        setData,
        data,

        setFurniture,

        onChangeFurniture,
      }}
      children={children}
    />
  );
};

export const useFurniture = (): FurnitureState => useContext(FurnitureContext);
