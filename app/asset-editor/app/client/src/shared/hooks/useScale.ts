import { useEffect, useState } from "react";
import { getScale, setScale } from "shared/utils";

export const useScale = (): [
  number,
  (scale: number | ((scale) => number)) => void,
] => {
  const [scale, _setScale] = useState<number>(getScale());

  useEffect(() => {
    setScale(scale);
  }, [scale]);

  return [scale, _setScale];
};
