import React, { ReactNode, useCallback, useContext, useState } from "react";

type ScaleState = {
  scale: number;
  setScale: (scale: number) => void;
};

const ScaleContext = React.createContext<ScaleState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const ScaleProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const [scale, $setScale] = useState<number>(3);

  const setScale = useCallback(
    (scale: number) => {
      if (scale >= 4) return $setScale(4);
      if (0 >= scale) return $setScale(1);
      $setScale(scale);
    },
    [$setScale],
  );

  return (
    <ScaleContext.Provider
      value={{
        setScale,
        scale,
      }}
      children={children}
    />
  );
};

export const useScale = (): ScaleState => useContext(ScaleContext);
