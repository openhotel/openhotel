import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import { SafeWindowContext } from "./safe-window.context";
import { Event, Size, useEvents, useWindow } from "@openhotel/pixi-components";
import { SAFE_ASPECT_RATIO } from "shared/consts";
import { InternalEvent } from "shared/enums";

type TemplateProps = {
  children: ReactNode;
};

export const SafeWindowProvider: React.FunctionComponent<TemplateProps> = ({
  children,
}) => {
  const { getSize } = useWindow();
  const { on, emit } = useEvents();
  const safeWindowSizeRef = useRef<Size>(null);
  const safeXPositionRef = useRef<number>(0);

  const onResize = useCallback(
    (size: Size) => {
      const targetSize = {
        width:
          size.width / size.height > SAFE_ASPECT_RATIO
            ? Math.round(size.height * SAFE_ASPECT_RATIO)
            : size.width,
        height: size.height,
      };

      const safeXPosition = Math.round((targetSize.width - size.width) / 2);

      if (safeXPosition !== safeXPositionRef.current) {
        safeXPositionRef.current = safeXPosition;
        emit(InternalEvent.SAFE_POSITION_X, safeXPosition);
      }

      if (
        safeWindowSizeRef.current?.width !== targetSize.width ||
        safeWindowSizeRef.current?.height !== targetSize.height
      ) {
        safeWindowSizeRef.current = targetSize;
        emit(InternalEvent.SAFE_RESIZE, targetSize);
      }
    },
    [emit],
  );

  useEffect(() => {
    const removeOnResize = on(Event.RESIZE, onResize);
    onResize(getSize());

    return () => {
      removeOnResize();
    };
  }, [on, onResize, onResize]);

  const getSafeSize = useCallback(() => safeWindowSizeRef.current, []);
  const getSafeXPosition = useCallback(() => safeXPositionRef.current, []);

  return (
    <SafeWindowContext.Provider
      value={{
        getSafeSize,
        getSafeXPosition,
      }}
      children={children}
    />
  );
};
