import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import { Size2d } from "shared/types";

//@ts-ignore
import { getImageSize } from "shared/utils";
import { useScale } from "shared/hooks/useScale";

type Props = {
  className?: string;
  style?: CSSProperties;

  src?: string;
};

export const ImageComponent: React.FC<Props> = ({ className, style, src }) => {
  const { scale, setScale } = useScale();

  const [size, setSize] = useState<Size2d>(null);

  useEffect(() => {
    getImageSize(src).then(setSize);
  }, [src]);

  const onClick = useCallback(
    (event) => {
      event.preventDefault();
      setScale(scale + 1);
    },
    [setScale, scale],
  );

  const onContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      setScale(scale - 1);
    },
    [setScale, scale],
  );

  if (!size) return null;

  return (
    <img
      className={className}
      style={style ?? {}}
      alt=""
      onClick={onClick}
      onContextMenu={onContextMenu}
      width={size.width * scale}
      height={size.height * scale}
      src={src}
    />
  );
};
